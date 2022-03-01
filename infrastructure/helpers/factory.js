'use strict'

const Helper = require('../helpers/helper');
const TemplateBuilder = require('./templateBuilder');
const CarouselComposer = require('./carouselComposer');

module.exports = class Factory {
    static getHandOffDialogue(payload) {
        let payload_tokens = payload.split(" ");
        let contact_number = payload_tokens[1];
        let business_name_raw = payload_tokens.splice(2).join(" ");
        let business_name = Helper.lowerCaseAllWordsExceptFirstLetters(business_name_raw);

        
        let handoffText = TemplateBuilder.buildTextTemplate(`You will be redirected to ${chatbot_store_name}'s Personal Shopper. Continue?`, 6, 6);
        let handoffButton1 = TemplateBuilder.buildButtonTemplate("Confirm", 3, 1, true, "open-url", `viber://chat?number=%2B${contact_number}`);
        let handoffButton2 = TemplateBuilder.buildButtonTemplate("Main Menu", 3, 1, false, "reply", `Main Menu`);
        

        const cards = [handoffText, handoffButton1, handoffButton2];
        let handOffDialogueBuild = TemplateBuilder.buildJsonTemplate(6, 7, cards);
        let handOffDialogueElement = TemplateBuilder.buildRichMediaMessage(handOffDialogueBuild);
        
        return handOffDialogueElement;
    }
}