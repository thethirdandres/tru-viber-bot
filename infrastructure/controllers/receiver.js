'use strict'

const Responder = require('./responder');
const Helper = require('../helpers/helper');


module.exports = class Receiver {
    static async handleMessage(user, message) {
        let response = [];
        let payload = message.text ? message.text : "UNDEFINED";
        console.log("Postback Message:", payload);
        if(Helper.isValidHttpUrl(payload)) {
            return response; 
        }
        
        let userState = await StoreData.getCustomerChatState(user.id);

        try {
            if(payload == "START" && userState == "" || payload == "GET STARTED" && userState == "") {
                response = Responder.genGetStartedMsgElements();
                Helper.getReqUtm();
            } else if(payload == "MAIN MENU" && userState == "") {
                response = (Responder.genMainMenuElements());
                userState = "";
                StoreData.updateCustomerChatState(user.id, "")
            } else if(payload == "CHOOSE STORE" && userState == "" || payload == "LIST OF STORES" && userState == "") {
                response = (Responder.genChooseStoreElements());
                userState = "";
                StoreData.updateCustomerChatState(user.id, "");
            } else if((payload == "METRO MANILA" || payload == "LUZON" || payload == "VISMIN") && userState == "") {
                response = (await Responder.genStoreElements(payload));
                userState = "";
                StoreData.updateCustomerChatState(user.id, "");
            } else if(payload == "LEARN MORE" && userState == "") {
                response = (Responder.genLearnMoreElements());
                userState = "";
                StoreData.updateCustomerChatState(user.id, "")
            } else if(payload.startsWith("STORE_CONTACT_NUMBER") && userState == "") {
                response = (Responder.genHandoffMsg(payload));
            } else if(payload.startsWith("HANDOFF") && userState == "") {
                userState = "QUIET_MODE";
                StoreData.updateCustomerChatState(user.id, userState);
                let firstMessage = await Helper.genMessageJson("Please wait a moment as we reconnect you to our personal shopper.");
                StoreData.saveQuietModeMsg(user, firstMessage, "us");
                response = await Responder.genHandoffSequence(user, payload);
            } else {
                if(userState == "") {
                    response = (Responder.genErrorMsgElements());
                } else {
                    StoreData.addCustomerMainPsid(user, message);    
                    console.log("calling saveQuietModeMsg");
                    StoreData.saveQuietModeMsg(user, message, "user");
                }
            }
        } catch (error) {
            console.log(error);
        }
        
        if(userState == "") {
            response.push(Responder.genKeyboardElements());
        } 

        return response;
    }
}