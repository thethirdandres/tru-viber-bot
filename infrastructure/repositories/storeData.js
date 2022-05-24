'use strict'
require("dotenv").config();

const TemplateBuilder = require('../helpers/templateBuilder');
const Helper = require('../helpers/helper');


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
        const ent_snapshot = await db.collection("Tenant").where("parent_id", "==", "NnqVd51ZSWDpk6qVHJNt").where("region", "==", region).orderBy("order").get();
        if(ent_snapshot.empty && rds_snapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        const snapshot = ent_snapshot.docs.concat(rds_snapshot.docs);
        this.maxStoreNum = ent_snapshot.size + rds_snapshot.size;
        
        return snapshot;
    }


    static async setUserDetails(user, message) {
        let document = db.collection("Customers").where('userId', '==', user.id).get();
        if (document && document.exists) {
            await document.update({
                updateDate: new Date().toISOString(),
                lastMessage: message,
                lastMessageDate: new Date().toISOString(),
            });
            console.log('Added user profile with ID: ', user.id)
        }
        else {
            await db.collection("Customers").doc(`${user.id}`).set({
                userId: user.id,
                state: "",
                updateDate: new Date().toISOString(),
                currentSession: "",
                channel: "viber",
                lastMessage: message,
                lastMessageDate: new Date().toISOString(),
                lastMessageFrom: user.name
            });
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
                        'ActionType': 'reply',
                        'ActionBody': `STORE_CONTACT_NUMBER_CHATBOT_STORE_NAME ${doc.data().contact_number} ${doc.data().parent} ${doc.data().chatbot_store_name}`,
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
                        'ActionBody': `STORE_CONTACT_NUMBER_CHATBOT_STORE_NAME ${doc.data().contact_number} ${doc.data().parent} ${doc.data().chatbot_store_name}`,
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

        console.log('storeListBuild: ', storeListBuild)
        console.log('storeListElement: ', storeListElement)

        return [storeListElement];
    }

    static async updateCurrentSession(user, payload) {
        let document = await db.collection("Customers").where('userId', '==', user.id).get();
        
        let payload_tokens = payload.split(" ");
        let contact_number = payload_tokens[1];
        let parent_id = payload_tokens[2];
        let chatbot_store_name_raw = payload_tokens.splice(4).join(" ");
        let chatbot_store_name = Helper.lowerCaseAllWordsExceptFirstLetters(chatbot_store_name_raw);

        let store = await db.collection("TemporaryTenant").where("parent", "==", parent_id).where("business_name", "==", chatbot_store_name).get();

        console.log("document", document.docs);
        console.log("store", store.docs);
        console.log(document.exists);
        console.log(store.exists);
        if (document && store && document.exists && store.exists) {
            await document.update({
                currentSession: store[0].data().doc_id
            });
            console.log('Entered session with personal shopper with userId: ', user.id);
        } else {
            console.log("No session was changed.");
        }
    }
}