'use strict'
require("dotenv").config();

const admin = require("firebase-admin");
const TemplateBuilder = require('../helpers/templateBuilder');
const Helper = require('../helpers/helper');

admin.initializeApp({
    credential: admin.credential.cert(
        JSON.parse(Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString('ascii'))
    )
});

let db = admin.firestore();

module.exports = class StoreData {
    static maxStoreNum = 0;

    static async getStoresPerRegion(region) {
        const rds_snapshot = await db.collection("Tenant").where("parent", "==", "108870114890548").where("region", "==", region).orderBy("order").where("viber_uri", "!=", "").get();
            // const ent_snapshot = await db.collection("Tenant").where("parent_id", "==", "NnqVd51ZSWDpk6qVHJNt").where("region", "==", region).orderBy("order").get();
        if(rds_snapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        // const snapshot = ent_snapshot.docs.concat(rds_snapshot.docs);
        // this.maxStoreNum = ent_snapshot.size + rds_snapshot.size;
        this.maxStoreNum = rds_snapshot.size;
        
        return rds_snapshot;
    }


    static async setUserDetails(user, message) {
        try {
            let userId = await Helper.trimSlashUserId(user.id);
            let messageTxt = message.text.startsWith("viber://pa?chatURI") ? "Handoff" : message.text.split("|")[2];
            let customerRef = db.collection("Customers").doc(userId);
            let customerDoc = await customerRef.get();
            let userAvatar = user.avatar == null ? "" : user.avatar;
            
            if(customerDoc.exists) {
                await customerRef.update({
                    updateDate: admin.firestore.Timestamp.fromDate(new Date()),
                    lastMessage: messageTxt,
                    lastMessageDate: admin.firestore.Timestamp.fromDate(new Date()),
                    docId: user.id
                });
                console.log('UPDATED user profile for : ', user.name)

            } else {
                await customerRef.set({
                    docId: user.id,
                    state: "",
                    updateDate: admin.firestore.Timestamp.fromDate(new Date()),
                    currentSession: "",
                    channel: "viber",
                    lastMessage: messageTxt,
                    lastMessageDate: admin.firestore.Timestamp.fromDate(new Date()),
                    lastMessageFrom: user.name.split(" ")[0],
                    profilePicture: userAvatar,
                    customerName: user.name,

                });
                console.log('CREATED user profile for : ', user.name)

            }

        } catch(error) {
            console.log(error);
        }
    }

    static async getStoreElement(region) {
        console.log("Passed region:", region);
        let result = [];
        let result2 = [];
        let snapshot = await StoreData.getStoresPerRegion(region);
        let row = Math.round(StoreData.maxStoreNum/2);
        let ctr = row;
        snapshot.forEach(async (doc) => {
            if(ctr > 14) {
                result.push(
                    {
                        'Columns': 3,
                        'Rows': 1,
                        'Silent': true,
                        'ActionType': 'open-url',
                        'ActionBody': `viber://pa?chatURI=${doc.data().viber_uri}&context=MAIN~${doc.data().viber_uri}`,
                        "Image": doc.data().button_img
                    }
                );
            } else {
                result2.push(
                    {
                        'Columns': 3,
                        'Rows': 1,
                        'Silent': true,
                        'ActionType': 'open-url',
                        'ActionBody': `viber://pa?chatURI=${doc.data().viber_uri}&context=MAIN~${doc.data().viber_uri}`,
                        "Image": doc.data().button_img
                    }
    
                );
            }

            ctr--;
            
        });
        
        const cards = result2.length != 0 ? result2.concat(result) : result2;
        row = row > 7 ? Math.round(row/2) : row;

        let storeListBuild = TemplateBuilder.buildJsonTemplate(6, row, cards);
        let storeListElement = TemplateBuilder.buildRichMediaMessage(storeListBuild);

        return [storeListElement];
    }

    static async updateCurrentSession(user, sessionId) {
        try {
            let userId = await Helper.trimSlashUserId(user.id);
            let customerRef = db.collection("Customers").doc(userId);
            let customerDoc = await customerRef.get();

            if(customerDoc.exists){
                customerRef.update({
                    "currentSession": sessionId
                })

                if(sessionId !== "") {
                    let custRefOnTenant = db.collection(`Tenant/${sessionId}/Customers`).doc(userId);
                    let custDocOnTenant = await custRefOnTenant.get();
                    
                    if(sessionId === "" || !custDocOnTenant.exists){
                        custRefOnTenant.set(customerDoc.data())
                    }
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    static updateCustomerChatState(userId, state){
        try {
            const customerRef = db.collection("Customers").doc(userId)
            customerRef.get().then((customerSnapshot)=>{
                if(customerSnapshot.exists){
                    customerRef.update({
                        "state": state,
                    });
                    console.log("Customer state updated to ", state);
                } 
            })
        } catch (error) {
            console.log(error);
            return;
        }
    }

    static async getCustomerChatState(userId){
        try {
            let customerData = await db.doc(`Customers/${userId}`).get();

            if (!customerData.exists) {
                console.log('No such document!');
                return null;
            } else {
                // console.log('Document data:', customerData.data());
                return customerData.data()['state'];
            }
        } catch (error) {
            return null
        }
    }

    static async getCustomerCurrentSession(userId) {
        try {
            let customerData = await db.doc(`Customers/${userId}`).get();

            if (!customerData.exists) {
                console.log('No such document!');
                return null;
            } else {
                // console.log('Document data:', customerData.data());
                return customerData.data()['currentSession'];
            }
        } catch (error) {
            return null
        }
    }

    static async saveQuietModeMsg(user, message, from) {
        try {
            let userId = await Helper.trimSlashUserId(user.id);
            let customerRef = await db.collection("Customers").doc(userId).get();
            let textMsg = "";
            let type;
            
            if(customerRef.exists){
                let tenantId = customerRef.data()['currentSession'];

                let tenCustRef = db.collection(`Tenant/${tenantId}/Customers/${userId}/Conversations`);
                let tenCustDoc = await tenCustRef.get();
                let attachments = {};
                
                if(message.text) {
                    if(message.text.startsWith("POSTBACK|")) {
                        if(message.text.startsWith("POSTBACK|HANDOFF")) {                    
                            textMsg = "Received new customer inquiry";
                        } else {
                            textMsg = "";
                        }
                    } else {
                        textMsg = message.text;
                    }
                } else if (message.url) {
                    type = message.size ? "video" : message.filename? "file" : message.stickerId ? "sticker" : "image";
                    attachments['data'] = [];
                    if(type === "video") {
                        let video_data = {
                            "video_data": {
                                "preview_url": message.thumbnail,
                                "url": message.url,
                            },
                            "type": "video",
                            "mime_type": "video"
                        }
            
                        attachments['data'].push(video_data);
                    } else {
                        let image_data = {
                            "image_data": {
                                "preview_url": message.url,
                                "url": message.url,
                            },
                            "type": type,
                            "mime_type": type
                        }
            
                        attachments['data'].push(image_data);
                    }
        
                    textMsg = "";
                }
 
                if(!tenCustDoc.exists) {
                    if(message.text) {
                        tenCustRef.doc(message.token).set({
                            attachments: {},
                            date: admin.firestore.Timestamp.fromDate(new Date()),
                            docId: message.token,
                            from: from,
                            message: textMsg
                        })
                    } else if(message.url) {
                        tenCustRef.doc(message.token).set({
                            attachments: attachments,
                            date: admin.firestore.Timestamp.fromDate(new Date()),
                            docId: message.token,
                            from: from,
                            message: ""
                        })
                    }
                }
                
            }

        } catch (error) {
            console.log(error);
        }
    } 

    static async addCustomerMainPsid(user, message) {
        let textMsg = ""; //goes to notifs and Conversation documents
        let lastMessage = ""; //goes to lastMessage field of Tenant/Customers
        let attachments = [];
        let mid = message.token;
        let userId = await Helper.trimSlashUserId(user.id);
        let docId = await this.getCustomerCurrentSession(userId);
        let type;
        let userAvatar = user.avatar == null ? "" : user.avatar;

       if(message.text) {
            if(message.text.startsWith("POSTBACK|")) {
                if(message.text.startsWith("POSTBACK|HANDOFF")) {                    
                    textMsg = "Received new customer inquiry";
                    lastMessage = textMsg;
                } else {
                    textMsg = "";
                    lastMessage = "Received button postback";
                }
            } else {
                lastMessage = message.text;
                textMsg = message.text;
            }
        } else if (message.url) {
            type = message.size ? "video" : message.filename? "file" : message.stickerId ? "sticker" : "image";
            attachments['data'] = [];
            if(type === "video") {
                let video_data = {
                    "video_data": {
                        "preview_url": message.thumbnail,
                        "url": message.url,
                    },
                    "type": "video",
                    "mime_type": "video"
                }
    
                attachments['data'].push(video_data);
            } else {
                let image_data = {
                    "image_data": {
                        "preview_url": message.url,
                        "url": message.url,
                    },
                    "type": type,
                    "mime_type": type
                }
    
                attachments['data'].push(image_data);
            }

            textMsg = "";
            lastMessage = "Received " + type;
        }

        console.log("docId in addCustomerMainPsid", docId);
        console.log("typeof docId in addCustomerMainPsid", typeof docId);

        if(docId !== "" || !docId || docId.length !== 0) {
            try {
                const customerRef = db.collection(`Tenant/${docId}/Customers`).doc(user.id);
                customerRef.get().then((customerSnapshot)=>{
                    if(customerSnapshot.exists){
                        customerRef.update({
                            "channel": "viber",
                            "customerName": user.name,
                            "docId": user.id,
                            "lastMessage": lastMessage,
                            "lastMessageFrom": user.name.split(" ")[0],
                            "lastMessageDate": admin.firestore.Timestamp.fromDate(new Date()),
                            "updateDate": admin.firestore.Timestamp.fromDate(new Date()),
                            "state": "", //set to currrentSession from root Customers
                            "profilePicture": userAvatar
                        })
                    } else{
                        customerRef.set({
                            "channel": "viber",
                            "customerName": user.name,
                            "docId": user.id,
                            "lastMessage": lastMessage,
                            "lastMessageFrom": user.name.split(" ")[0],
                            "lastMessageDate": admin.firestore.Timestamp.fromDate(new Date()),
                            "updateDate": admin.firestore.Timestamp.fromDate(new Date()),
                            "state": "",
                            "profilePicture": userAvatar
                        });
                    }
                })

                const customerConvoRef = db.collection(`Tenant/${docId}/Customers/${user.id}/Conversations`).doc(mid);
                customerConvoRef.get().then((convoSnap)=>{
                    if(!convoSnap.exists){
                        customerConvoRef.set({
                            "attachments": attachments,
                            "date": admin.firestore.Timestamp.fromDate(new Date()),
                            "docId": mid,
                            "from": "user",
                            "message": textMsg,
                            "status": "unread"
                        });
                    } 
                })

                db.collection('User').where('tenantId','==', docId).get().then(users=>{
                    users.docs.forEach(async pgiUser=>{
                        let userData = pgiUser.data();
                        let displayName = user.name;
                        
                        let message;
                        let bodyTxt = "";
                        if(attachments.length > 0){
                            bodyTxt = `${displayName} sent an attachment`;
                            if(attachments['data'].type == "image"){
                                message = {
                                    "notification": {
                                        "title": `${displayName} ● Viber`,
                                        "body": bodyTxt,
                                        "imageUrl": attachments['data'].image_data.url
                                    },
                                    "token": userData['messagingToken']
                                }
                            } else{
                                message = {
                                    "notification": {
                                        "title": `${displayName} ● Viber`,
                                        "body": `${displayName} sent an attachment`
                                    },
                                    "token": userData['messagingToken']
                                }
                            }
                        } else{
                            bodyTxt = `${displayName} sent a message`
                            message = {
                                "notification": {
                                    "title": `${displayName} ● Viber`,
                                    "body": textMsg
                                },
                                "token": userData['messagingToken']
                            }
                        }
                        console.log("MESSAGE DATA: ",message);
                        this.sendPushNotification(message)

                        const userNotifRef = db.collection(`User/${userData['docId']}/Notification`).doc();
                        userNotifRef.get().then((userNotifSnap)=>{
                            if(!userNotifSnap.exists){
                                userNotifRef.set({
                                    "createDate": admin.firestore.Timestamp.fromDate(new Date()),
                                    "mid": mid,
                                    "tid": docId,
                                    "title": bodyTxt,
                                    "notificationStatus": "unread",
                                    "message": textMsg,
                                    "status": "unread",
                                    "cid": userId
                                });
                            } 
                        })

                    })
                })


            } catch (error) {
                console.log(error);
                return "ok";
            }
        }
        return "ok";
    }

    static sendPushNotification(message){
        admin.messaging().send(message).then((response)=>{
            console.log('Success!', response)
        }).catch((error)=>{
            console.log("Error", error);
        })
    }

}