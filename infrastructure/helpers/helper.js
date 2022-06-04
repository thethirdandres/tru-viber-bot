'use strict'


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

    static async getDateAsToken() {
        var today = new Date();
        var date = today.getFullYear()+ "" + (today.getMonth()+1) + "" + today.getDate();
        var time = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
        var dateTime = date+time;

        return dateTime;
    }

    static async genMessageJson(text) {
        return {
            text: text,
            token: await this.getDateAsToken()
        }
    }

    static async trimSlashUserId(viberId) {
        let trimmedId = viberId.split("/");

        if(trimmedId.length > 1) {
            let newId = "";
            trimmedId.forEach(token => {
                newId += token;
            })
            return newId;
        }

        return viberId;
    }
}