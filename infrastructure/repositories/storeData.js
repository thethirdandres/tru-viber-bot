'use strict'
require("dotenv").config();

const TemplateBuilder = require('../helpers/templateBuilder');

const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(
        JSON.parse(Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString('ascii'))
    )
});

let db = admin.firestore();

module.exports = class StoreData {
    static maxStoreNum = 0;

    static async getStoresPerRegion(region) {
        const rds_snapshot = await db.collection("TemporaryTenant").where("parent", "==", "108870114890548").where("region", "==", region).orderBy("order").get();
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
            let customerRef = db.collection("Customers").doc(user.id);
            let customerDoc = await customerRef.get();

            if(customerDoc.exists) {
                await customerRef.update({
                    updateDate: admin.firestore.Timestamp.fromDate(new Date()),
                    lastMessage: message,
                    lastMessageDate: admin.firestore.Timestamp.fromDate(new Date()),
                });
            } else {
                await customerRef.set({
                    docId: user.id,
                    state: "",
                    updateDate: admin.firestore.Timestamp.fromDate(new Date()),
                    currentSession: "",
                    channel: "viber",
                    lastMessage: message,
                    lastMessageDate: admin.firestore.Timestamp.fromDate(new Date()),
                    lastMessageFrom: user.name.split(" ")[0],
                    profilePicture: user.avatar,
                    customerName: user.name,

                });
            }

        } catch(error) {
            console.log(error);
        }

        console.log('Updated user profile for : ', user.name)
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
                        'ActionType': 'reply',
                        'ActionBody': `POSTBACK|STORE_CONTACT_NUMBER_CHATBOT_STORE_NAME ${doc.data().contact_number} ${doc.data().doc_id} ${doc.data().chatbot_store_name}`,
                        "Image": doc.data().button_img
                    }
                );
            } else {
                result2.push(
                    {
                        'Columns': 3,
                        'Rows': 1,
                        'Silent': true,
                        'ActionType': 'reply',
                        'ActionBody': `POSTBACK|STORE_CONTACT_NUMBER_CHATBOT_STORE_NAME ${doc.data().contact_number} ${doc.data().doc_id} ${doc.data().chatbot_store_name}`,
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

    static async updateCurrentSession(user, payload) {
        let payload_tokens = payload.split(" ");
        // let contact_number = payload_tokens[1];
        // let parent_id = payload_tokens[2];
        let doc_id = payload_tokens[2];
        // let chatbot_store_name_raw = payload_tokens.splice(4).join(" ");
        // let chatbot_store_name = Helper.lowerCaseAllWordsExceptFirstLetters(chatbot_store_name_raw);

        try {
            let customerRef = db.collection("Customers").doc(user.id)
            let customerDoc = await customerRef.get();

            if(customerDoc.exists){
                customerRef.update({
                    "currentSession": doc_id
                })

                let custRefOnTenant = db.collection(`Tenant/${doc_id}/Customers`).doc(user.id);
                let custDocOnTenant = await custRefOnTenant.get();

                if(!custDocOnTenant.exists){
                    custRefOnTenant.set(customerDoc.data())
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
            let customerRef = await db.collection("Customers").doc(user.id).get();
            
            if(customerRef.exists){
                let tenantId = customerRef.data()['currentSession'];

                let tenCustRef = db.collection(`TemporaryTenant/${tenantId}/Customers/${user.id}/Conversations`);
                let tenCustDoc = await tenCustRef.get();
                let attachments = {};
                
                let mime_type = message.size ? "video" : message.filename? "file" : message.stickerId ? "sticker" : " image";
                attachments['data'] = [];
                let image_data = {
                    "image_data": {
                        "preview_url": message.url,
                        "url": message.url,
                    },
                    "mime_type": mime_type
                }

                attachments['data'].push(image_data);
 
                if(!tenCustDoc.exists) {
                    if(message.text) {
                        tenCustRef.doc(message.token).set({
                            attachments: {},
                            date: admin.firestore.Timestamp.fromDate(new Date()),
                            docId: message.token,
                            from: from,
                            message: message.text
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
        let textMsg = "";
        let attachments = [];
        let mid = message.token;
        let docId = await this.getCustomerCurrentSession(user.id);
        if(message.text) {
            textMsg = message.text ? message.text : "";
        } else if (message.url) {
            let type = message.size ? "video" : message.filename? "file" : message.stickerId ? "sticker" : " image";

            attachments['data'] = [];
            let image_data = {
                "image_data": {
                    "preview_url": message.url,
                    "url": message.url,
                },
                "type": type
            }

            attachments['data'].push(image_data);
        }

        try {
            const customerRef = db.collection(`TemporaryTenant/${docId}/Customers`).doc(user.id);
            customerRef.get().then((customerSnapshot)=>{
                if(customerSnapshot.exists){
                    customerRef.update({
                        "channel": "viber",
                        "customerName": user.name,
                        "docId": user.id,
                        "lastMessage": textMsg,
                        "lastMessageFrom": user.name.split(" ")[0],
                        "lastMessageDate": admin.firestore.Timestamp.fromDate(new Date()),
                        "updateDate": admin.firestore.Timestamp.fromDate(new Date()),
                    });
                } else{
                    customerRef.set({
                        "channel": "viber",
                        "customerName": user.name,
                        "docId": user.id,
                        "lastMessage": "",
                        "lastMessageFrom": user.name.split(" ")[0],
                        "lastMessageDate": admin.firestore.Timestamp.fromDate(new Date()),
                        "updateDate": admin.firestore.Timestamp.fromDate(new Date()),
                    });
                }
            })

            const customerConvoRef = db.collection(`TemporaryTenant/${docId}/Customers/${user.id}/Conversations`).doc(mid);
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
                    if(attachments.size > 0){
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
                                    "title": `${displayName} ● Messenger`,
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
                                "cid": user.id
                            });
                        } 
                    })

                })
            })


        } catch (error) {
            console.log(error);
            return "ok";
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