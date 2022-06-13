'use strict'
require("dotenv").config();

const admin = require("firebase-admin");
const TemplateBuilder = require("../helpers/templateBuilder");

admin.initializeApp({
    credential: admin.credential.cert(
        JSON.parse(Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString('ascii'))
    )
});

let db = admin.firestore()

module.exports = class StoreData {
    static maxStoreNum = 0;

    static async getStoresPerRegion(region) {
        const rds_snapshot = await db.collection("TemporaryTenant").where("parent", "==", "108870114890548").where("region", "==", region).orderBy("order").get();
        const ent_snapshot = await db.collection("Tenant").where("parent_id", "==", "NnqVd51ZSWDpk6qVHJNt").where("is_chatbot_active", "==", true).where("region", "==", region).orderBy("order").get();
        console.log(ent_snapshot);
        if(ent_snapshot.empty && rds_snapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        const snapshot = ent_snapshot.docs.concat(rds_snapshot.docs);
        this.maxStoreNum = ent_snapshot.size + rds_snapshot.size;
        
        return snapshot;
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
                        'ActionBody': `STORE_CONTACT_NUMBER_CHATBOT_STORE_NAME ${doc.data().contact_number} ${doc.data().chatbot_store_name}`,
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
                        'ActionBody': `STORE_CONTACT_NUMBER_CHATBOT_STORE_NAME ${doc.data().contact_number} ${doc.data().chatbot_store_name}`,
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


    static async setUserDetails(userId) {
        let document = db.collection("ViberCustomers").where('userId', '==', userId).get();
        if (document && document.exists) {
            await document.update({
                last_message_entry: new Date().toISOString(),
                type: "TRU" //for old data (without TYPE field) to be overwritten with type field
            });
            console.log('Added user profile with ID: ', userId)
        }
        else {
            await db.collection("ViberCustomers").add({
                userId: userId,
                last_message_entry: new Date().toISOString(),
                type: "TRU"
            });
        }  
    }
}