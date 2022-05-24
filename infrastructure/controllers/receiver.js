'use strict'

const Responder = require('./responder');
const Helper = require('../helpers/helper');


module.exports = class Receiver {
    static async handleMessage(user, message) {
        let response = [];
        let payload = message.text.toUpperCase();
        console.log("Postback Message:", payload);
        if(Helper.isValidHttpUrl(payload)) {
            return response; 
        }
        
        try {
            if(payload == "START" || payload == "GET STARTED") {
                response = Responder.genGetStartedMsgElements();
                Helper.getReqUtm();
            } else if(payload == "MAIN MENU") {
                response = (Responder.genMainMenuElements());
            } else if(payload == "CHOOSE STORE" || payload == "LIST OF STORES") {
                response = (Responder.genChooseStoreElements());
            } else if(payload == "METRO MANILA" || payload == "LUZON" || payload == "VISMIN") {
                response = (await Responder.genStoreElements(payload));
            } else if(payload == "LEARN MORE") {
                response = (Responder.genLearnMoreElements());
            } else if(payload.startsWith("STORE_CONTACT_NUMBER")) {
                response = (Responder.genHandoffMsg(payload));
            } else if(payload.startsWith("HANDOFF")) {
                Responder.genHandoffSequence(user, payload);
            } else {
                response = (Responder.genErrorMsgElements());
            }
        } catch (error) {
            console.log(error);
        }
        
        response.push(Responder.genKeyboardElements());

        return response;
    }
}