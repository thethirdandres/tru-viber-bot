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
            await db.collection("Customers").doc(user.id).set({
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
}