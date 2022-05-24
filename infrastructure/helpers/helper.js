'use strict'


const TemplateBuilder = require('./templateBuilder');
const StoreData = require('../repositories/storeData');
const https = require('https');

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
   
    
        
        const cards = result2.length != 0 ? result2.concat(result) : result2;
        row = row > 7 ? Math.round(row/2) : row;

        let storeListBuild = TemplateBuilder.buildJsonTemplate(6, row, cards);
        let storeListElement = TemplateBuilder.buildRichMediaMessage(storeListBuild);

        console.log('storeListBuild: ', storeListBuild)
        console.log('storeListElement: ', storeListElement)

        return [storeListElement];
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