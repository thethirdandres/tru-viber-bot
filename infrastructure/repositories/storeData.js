'use strict'
require("dotenv").config();

const admin = require("firebase-admin");

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
        const ent_snapshot = await db.collection("TemporaryTenant").where("parent", "==", "ULoEpwWoNTS8k8IMAEId").where("region", "==", region).orderBy("order").get();
        if(ent_snapshot.empty && rds_snapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        const snapshot = ent_snapshot.docs.concat(rds_snapshot.docs);
        this.maxStoreNum = ent_snapshot.size + rds_snapshot.size;
        
        return snapshot;
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

        // let customerMessagesDoc = db.collection("CustomerMessages").where('userId', '==', userId).get();
        // if (customerMessagesDoc && customerMessagesDoc.exists) {
        //     await customerMessagesDoc.update({
        //         last_message_entry: new Date().toISOString(),
        //     });
        //     console.log('Added to CustomerMessages with ID: ', userId)
        // }
        // else {
        //     await db.collection("CustomerMessages").doc(`${userId}`).set({
        //         viber_bot_token: "4ea6ae36e827e6ba-741fc9b77a92e333-4ec099c241654373",
        //         is_messaged: false,
        //         last_message_entry: new Date().toISOString(),
        //         userId: userId,
        //         type: "VIBER"
        //     });
        // }
                
    }
    
}