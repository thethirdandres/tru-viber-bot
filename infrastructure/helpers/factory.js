'use strict'

const Helper = require('../helpers/helper');
const TemplateBuilder = require('./templateBuilder');

module.exports = class Factory {
    static getHandOffDialogue(payload) {
        let payload_tokens = payload.split(" ");
        let contact_number = payload_tokens[1];
        let parent_id = payload_tokens[2];
        let chatbot_store_name_raw = payload_tokens.splice(4).join(" ");
        let chatbot_store_name = Helper.lowerCaseAllWordsExceptFirstLetters(chatbot_store_name_raw);
        let chatbot_store_name_full = "Toys\"R\"Us ".concat(chatbot_store_name);
        

        // let handoffText = TemplateBuilder.buildTextTemplate(`You will be redirected to ${chatbot_store_name_full} official chat box, just type "Hello" to start a conversation.`, 6, 6);
        let handoffText = TemplateBuilder.buildTextTemplate(`You will be connected to ${chatbot_store_name_full}'s personal shopper, do you want to continue?`, 6, 6);
        // let handoffButton1 = TemplateBuilder.buildButtonTemplate("Confirm", 3, 1, true, "open-url", `viber://chat?number=%2B${contact_number}`);
        let handoffButton1 = TemplateBuilder.buildButtonTemplate("Confirm", 3, 1, true, "reply", `POSTBACK|HANDOFF_${payload}`);
        let handoffButton2 = TemplateBuilder.buildButtonTemplate("Main Menu", 3, 1, false, "reply", `POSTBACK|MAIN MENU|Main Menu`);

        console.log("User being connected to personal shopper.");
      
        const cards = [handoffText, handoffButton1, handoffButton2];
        let handOffDialogueBuild = TemplateBuilder.buildJsonTemplate(6, 7, cards);
        let handOffDialogueElement = TemplateBuilder.buildRichMediaMessage(handOffDialogueBuild);
        
        return handOffDialogueElement;
    }
}