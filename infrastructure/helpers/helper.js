'use strict'


const CarouselComposer = require('./carouselComposer');
const StoreData = require('../repositories/storeData');

module.exports = class Helper {
        
    static isValidHttpUrl(string) {
        let url;
        
        try {
        url = new URL(string);
        } catch (_) {
        return false;  
        }
    
        return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "viber:";
    }
   
    static async getStoreElement(region) {
        console.log("Passed region:", region);
        let result = [];
        let result2 = [];
        let snapshot = await StoreData.getStoresPerRegion(region);
        let row = Math.round(StoreData.maxStoreNum/2);
        let ctr = row;
        row = row > 7 ? 7 : row;
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

        // CHANGE THIS WITHOUT USING CAROUSELCOMPOSER
        let stores = new CarouselComposer('#D3D3D3', row);
        stores.addCarouselElement(result);
        stores.addCarouselElement(result2);

        return stores.build();
    }

    static lowerCaseAllWordsExceptFirstLetters(string) {
        return string.replace(/\S*/g, function (word) {
            return word.charAt(0) + word.slice(1).toLowerCase();
        });
    }

    static getReqUtm() {
        https.get("https://tru.avigate.io/?utm_source=toysrus.com.ph&utm_medium=chat-button&utm_campaign=BR_engagement_chat&utm_content=fb-msg_eng_cmsgs", (res) => {
            console.log("GET BUTTON CLICKED - UTM Tags captured");
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
        
    }
}