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
        let snapshot = await StoreData.getStoresPerRegion(region);
        let row = Math.round(StoreData.maxStoreNum/2);
        snapshot.forEach(async (doc) => {
            result.push(
                {
                    'Columns': 3,
                    'Rows': 1,
                    'Silent': true,
                    'ActionType': 'reply',
                    'ActionBody': `STORE_CONTACT_NUMBER_BUSINESS_NAME ${doc.data().contact_number} ${doc.data().business_name}`,
                    "Image": doc.data().button_img
                }

            );
        });

        let stores = new CarouselComposer('#D3D3D3', row);
        stores.addCarouselElement(result);

        return stores.build();
    }

    static lowerCaseAllWordsExceptFirstLetters(string) {
        return string.replace(/\S*/g, function (word) {
            return word.charAt(0) + word.slice(1).toLowerCase();
        });
    }
}