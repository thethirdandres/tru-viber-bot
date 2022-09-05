'use strict'

const Responder = require('./responder');
const Helper = require('../helpers/helper');
const StoreData = require('../repositories/storeData');


module.exports = class Receiver {
    static async handleMessage(user, message) {
        let response = [];
        let payload = message.text ? message.text : "UNDEFINED";
        if(message.text) {
            payload = message.text.startsWith("POSTBACK|") ? message.text.split("|")[1] : message.text;
        }
        
        console.log("Postback message:", payload);
        if(Helper.isValidHttpUrl(payload)) {
            return response; 
        }

        let userId = await Helper.trimSlashUserId(user.id);
        console.log("userId in receiver", userId);
        let userState = await StoreData.getCustomerChatState(userId);

        try {
            if(payload == "START" || payload == "GET STARTED") {
                if(userState == "") {
                    Helper.getReqUtm();
                } else if(userState == "QUIET_MODE") {
                    console.log("ENTERED GET STARTED SEQUENCE");
                    StoreData.updateCurrentSession(user, "");
                    userState = "";
                }
                
                response = Responder.genGetStartedMsgElements();

            } else if(payload == "MAIN MENU" && userState == "") {
                response = (Responder.genMainMenuElements());
                userState = "";
            } else if(payload == "CHOOSE STORE" && userState == "" || payload == "LIST OF STORES" && userState == "") {
                response = (Responder.genChooseStoreElements());
                userState = "";;
            } else if((payload == "METRO MANILA" || payload == "LUZON" || payload == "VISMIN") && userState == "") {
                response = (await Responder.genStoreElements(payload));
                userState = "";
            } else if(payload == "LEARN MORE" && userState == "") {
                response = (Responder.genLearnMoreElements());
                userState = "";
            } else if(payload.startsWith("STORE_CONTACT_NUMBER") && userState == "") {
                response = (Responder.genHandoffMsg(payload));
            } else {
                if(userState == "") {
                    response = (Responder.genErrorMsgElements());
                } else {
                    await StoreData.saveQuietModeMsg(user, message, "user");
                }
            }
            
            StoreData.updateCustomerChatState(userId, userState);
            await StoreData.addCustomerMainPsid(user, message);      
        } catch (error) {
            console.log(error);
        }
        
        if(userState == "") {
            response.push(Responder.genKeyboardElements());
        } 

        return response;
    }
}