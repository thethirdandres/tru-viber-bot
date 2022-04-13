'use strict'

const Helper = require('../helpers/helper');
const TemplateBuilder = require('./templateBuilder');

module.exports = class Factory {
    static getHandOffDialogue(payload) {
        let payload_tokens = payload.split(" ");
        let contact_number = payload_tokens[1];
        let chatbot_store_name_raw = payload_tokens.splice(3).join(" ");
        let chatbot_store_name = Helper.lowerCaseAllWordsExceptFirstLetters(chatbot_store_name_raw);
        let chatbot_store_name_full = "Toys\"R\"Us ".concat(chatbot_store_name);
        

        let handoffText = TemplateBuilder.buildTextTemplate(`You will be redirected to ${chatbot_store_name_full} official chat box, just type "Hello" to start a conversation.`, 6, 6);
        let handoffButton1 = TemplateBuilder.buildButtonTemplate("Confirm", 3, 1, true, "open-url", `viber://chat?number=%2B${contact_number}`);
        let handoffButton2 = TemplateBuilder.buildButtonTemplate("Main Menu", 3, 1, false, "reply", `Main Menu`);
        
        const localStoresNotClosedThuFri = ["Robinsons Antipolo", "Harbor Point, Subic", "Serin Tagaytay", "Solenad 3, Nuvali"];
        const localStoresClosedFri = ["Robinsons Ilocos", "Robinsons Tuguegarao", "Robinsons Naga", "Robinsons Lipa", "U.P. Town Center"];
          
        // For Holy Week 2022
        if(localStoresClosedFri.includes(chatbot_store_name)) {
            handoffText = TemplateBuilder.buildTextTemplate(`Hello! Thank you for reaching out to Toys”R”Us.\n\nIn observance of the Holy Week, we are closed today, April 15 (Good Friday). We will resume regular operating hours on April 16, 2022, Saturday.\n\nThank you and we look forward to serving you!`, 6, 6);
            handoffButton1 = TemplateBuilder.buildButtonTemplate("Confirm", 3, 1, true, "open-url", `viber://chat?number=%2B${contact_number}`);
        } else if(!localStoresNotClosedThuFri.includes(chatbot_store_name)) {
            handoffText = TemplateBuilder.buildTextTemplate(`Hello! Thank you for reaching out to Toys”R”Us.\n\nIn observance of the Holy Week, we are closed today, April 14 (Maundy Thursday) until April 15 (Good Friday). We will resume regular operating hours on April 16, 2022, Saturday.\n\nThank you and we look forward to serving you!`, 6, 6);
            handoffButton1 = TemplateBuilder.buildButtonTemplate("Confirm", 3, 1, true, "open-url", `viber://chat?number=%2B${contact_number}`);
        } 

        const cards = [handoffText, handoffButton1, handoffButton2];
        let handOffDialogueBuild = TemplateBuilder.buildJsonTemplate(6, 7, cards);
        let handOffDialogueElement = TemplateBuilder.buildRichMediaMessage(handOffDialogueBuild);
        
        return handOffDialogueElement;
    }
}