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
        
        // For Holy Week 2022
        if(chatbot_store_name == "Xentro Mall Calapan" || //stores closed on Friday only
            chatbot_store_name == "Robinsons Palawan" ||
            chatbot_store_name == "Robinsons Naga" ||
            chatbot_store_name == "Robinsons Angeles" ||
            chatbot_store_name == "Robinsons Santiago" ||
            chatbot_store_name == "Robinsons Tuguegarao" ||
            chatbot_store_name == "Robinsons Lipa" ||
            chatbot_store_name == "Robinsons Imus" ||
            chatbot_store_name == "Robinsons General Trias" ||
            chatbot_store_name == "Robinsons Galleria South" ||
            chatbot_store_name == "Robinsons Malolos" ||
            chatbot_store_name == "Robinsons Pangasinan" ||
            chatbot_store_name == "Robinsons Gapan" ||
            chatbot_store_name == "Robinsons Ilocos" ||
            chatbot_store_name == "Robinsons Iligan"
        ) {
            handoffText = TemplateBuilder.buildTextTemplate(`Hello! Thank you for reaching out to Robinsons Department Store.\nIn observance of the Holy Week, we are closed today, April 15 (Good Friday). We will resume regular operating hours on April 16, 2022 (Black Saturday).\nThank you and we look forward to serving you!`, 6, 6);
            handoffButton1 = TemplateBuilder.buildButtonTemplate("Confirm", 3, 1, true, "open-url", `viber://chat?number=%2B${contact_number}`);
        } else if(chatbot_store_name == "Robinsons Place Antipolo" || //stores not closing 
            chatbot_store_name == "Robinsons Townville Cabanatuan" ||
            chatbot_store_name == "Robinsons Pampanga" ||
            chatbot_store_name == "Robinsons La Union" ||
            chatbot_store_name == "Al Nor Cotabato"
        ) {
            console.log("Clicked open store.");
        } else { //stores closed on Thursday and Friday
            handoffText = TemplateBuilder.buildTextTemplate(`Hello! Thank you for reaching out to Robinsons Department Store.\nIn observance of the Holy Week, we are closed today, April 14 (Maundy Thursday) until April 15 (Good Friday). We will resume regular operating hours on April 16, 2022 (Black Saturday).\nThank you and we look forward to serving you!`, 6, 6);
            handoffButton1 = TemplateBuilder.buildButtonTemplate("Confirm", 3, 1, true, "open-url", `viber://chat?number=%2B${contact_number}`);
        }

        const cards = [handoffText, handoffButton1, handoffButton2];
        let handOffDialogueBuild = TemplateBuilder.buildJsonTemplate(6, 7, cards);
        let handOffDialogueElement = TemplateBuilder.buildRichMediaMessage(handOffDialogueBuild);
        
        return handOffDialogueElement;
    }
}