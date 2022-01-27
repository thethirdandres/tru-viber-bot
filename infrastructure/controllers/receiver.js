'use strict'

const Responder = require('./responder');
const Helper = require('../helpers/helper');


module.exports = class Receiver {
    static async handleMessage(message) {
        let response = [];
        let payload = message.text.toUpperCase();
        console.log("Message:", payload);
        if(Helper.isValidHttpUrl(payload)) {
            return response; 
        }
        
        try {
            if(payload == "START" || payload == "GET STARTED") {
                response = Responder.genGetStartedMsgElements();
            } else if(payload == "MAIN MENU") {
                response = (Responder.genMainMenuElements());
            } else if(payload == "CHOOSE STORE" || payload == "LIST OF STORES") {
                response = (Responder.genChooseStoreElements());
            } else if(payload == "METRO MANILA" || 
                        payload == "NORTH LUZON" || 
                        payload == "SOUTH LUZON" ||
                        payload == "VISAYAS" ||
                        payload == "MINDANAO") {
                response = (await Responder.genStoreElements(payload));
            } else if(payload == "LEARN MORE") {
                response = (Responder.genLearnMoreElements());
            } else if(payload == "SHOP ONLINE") {
                response = (Responder.genShopOnlineElements())
            } else if (payload == "~") {
                console.log("user clicked dummy button");
            } else if(payload.startsWith("STORE_CONTACT_NUMBER")) {
                console.log('It works!');
                response = (Responder.genHandoffMsg(payload));
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