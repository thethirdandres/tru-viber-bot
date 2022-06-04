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
            if(payload == "START" && userState == "" || payload == "GET STARTED" && userState == "") {
                response = Responder.genGetStartedMsgElements();
                Helper.getReqUtm();
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
            } else if(payload.startsWith("HANDOFF") && userState == "") {
                userState = "QUIET_MODE";
                response = await Responder.genHandoffSequence(user, payload);
                let firstMessage = await Helper.genMessageJson("Welcome! I'm your personal shopper for today. How may I help you?");
                StoreData.saveQuietModeMsg(user, firstMessage, "us");
            } else if(payload.toUpperCase() == "EXIT" && userState == "QUIET_MODE") {
                response = await Responder.genExitQuietModeMsg();
            } else if(payload == "CONFIRM_EXIT" && userState == "QUIET_MODE") {
                userState = "";
                response = await Responder.genConfirmExitQuietModeMsg();
                console.log(user.name, " is quitting QUIET_MODE");
                console.log("userState in confirm_exit", userState);
            } else if(payload == "CANCEL_EXIT" && userState == "QUIET_MODE") {
                response = await Responder.genCancelExitQuietModeMsg();
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