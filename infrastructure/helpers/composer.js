'use strict'

const TemplateBuilder = require('./templateBuilder');
const Factory = require("./factory");
const StoreData = require('../repositories/storeData');


module.exports = class Composer {
    static composeKeyboardElements() {
        return TemplateBuilder.buildKeyboard(TemplateBuilder.genKeyboardTemplate());
    }

    static composeGetStartedButtonElements() {
        let getStartedButtonRaw = TemplateBuilder.buildButtonTemplate("Get started", 6, 1, false, "reply", "POSTBACK|GET STARTED|Get started");
        let getStartedButtonBuild = TemplateBuilder.buildJsonTemplate(6, 1, [getStartedButtonRaw]);
        let getStartedButtonElement = TemplateBuilder.buildRichMediaMessage(getStartedButtonBuild);

        return getStartedButtonElement;
    }

    static composeGetStartedMsgElements() {
        let welcomeMsgElement = TemplateBuilder.buildTextMessage('Hi! 👋😊 I\'m Billie, your Toys"R"Us Chatbot. I can provide assistance for your shopping inquiries.');

        let privacyPolicyText = "We are committed to protecting and respecting your privacy as we store any personal information you may provide as we communicate. This includes this page and other local Facebook pages that you may be redirected to. \n\nBy proceeding, you're agreeing to our Privacy Policy which you can read more by clicking below: 👇"
        let privacyPolicyButtonText = TemplateBuilder.buildTextButtonTemplate(privacyPolicyText, 6, 6, "View Privacy Policy", 6, 1, true,  "open-url", "https://toysrus.com.ph/privacy-policy");
        
        let privacyPolicyBuild = TemplateBuilder.buildJsonTemplate(6, 7, privacyPolicyButtonText);
        let privacyPolicyElement = TemplateBuilder.buildRichMediaMessage(privacyPolicyBuild);

        return [welcomeMsgElement, privacyPolicyElement];
    }
    
    static composeMainMenuElements() {
        let mainMenuMsgElement = TemplateBuilder.buildTextMessage('How can we help you today?');
        
        let asImage = TemplateBuilder.buildImageTemplate("https://storage.googleapis.com/avigate-img-resources/tru-resources/chatbot-hotline-viber.jpg", 6, 5, true, "none");
        let asButtons1 = TemplateBuilder.buildButtonTemplate("Call 0917111TOYS", 6, 1, true, "open-url", "viber://chat?number=%2B639171118697");
        let asButtons2 = TemplateBuilder.buildButtonTemplate("CHOOSE PREFERRED STORE", 6, 1, false, "reply", "POSTBACK|CHOOSE STORE|Choose store");

        let rob = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/tru-resources/chatbot-pix_viber-rev-GoCart.jpg", 6, 5, true, "none", "GoCart", "SHOP ONLINE", 6, 1, true, "open-url", "https://toysrus.gorobinsons.ph");
        let laz = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/tru-resources/Chatbot%20Pictures/online%20stores/LazMall.jpg", 6, 5, true, "none", "Lazada", "SHOP ONLINE", 6, 1, true, "open-url", "https://www.lazada.com.ph/shop/toys-r-us");
        let sho = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/tru-resources/chatbot-pix_viber-rev-Shopee.jpg", 6, 5, true, "none", "Shopee", "SHOP ONLINE", 6, 1, true, "open-url", "https://shopee.ph/toysrusph");
        let met = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/general/chatbot-pix_viber-rev-Metromart.jpg", 6, 5, true, "none", "Metromart", "SHOP ONLINE", 6, 1, true, "open-url", "https://www.metromart.com/");

        const cards = [asImage, asButtons1, asButtons2, rob[0], rob[1], rob[2], laz[0], laz[1], laz[2], sho[0], sho[1], sho[2], met[0], met[1], met[2]];


        let mainMenuElementBuild = TemplateBuilder.buildJsonTemplate(6, 7, cards);
        let mainMenuElement = TemplateBuilder.buildRichMediaMessage(mainMenuElementBuild);

        return [mainMenuMsgElement, mainMenuElement];
    }

    static composeLearnMoreElements() {
        let learnMoreMsgElement = TemplateBuilder.buildTextMessage('Sure! 👍 What would you like to learn more about?');

        let promosEvents = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/tru-resources/chatbot-babyfair-viber%20(bcc6aa98-b8f7-48f8-8ae3-5a5fe193c69c).jpg", 6, 5, true, "none", "Promos and Events", "SELECT", 6, 1, true, "open-url", "https://toysrus.com.ph/catalog");
        let howShopPlay = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/tru-resources/Chatbot%20Pictures/others/csp-how-it-works.jpg", 6, 5, true, "none","How to Call Shop Play?", "SELECT", 6, 1, true, "open-url", "https://toysrus.com.ph/callshopplay");
        let returnExchange = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/tru-resources/Chatbot%20Pictures/others/return-and-exchange-policy.jpg", 6, 5, true, "none","Return and Exchange Policy", "SELECT", 6, 1, true, "open-url", "https://toysrus.com.ph/services");
        const cards = [promosEvents[0], promosEvents[1], promosEvents[2], howShopPlay[0], howShopPlay[1], howShopPlay[2], returnExchange[0], returnExchange[1], returnExchange[2]];


        let learnMoreBuild = TemplateBuilder.buildJsonTemplate(6, 7, cards);  
        let learnMoreElement = TemplateBuilder.buildRichMediaMessage(learnMoreBuild);

        return [learnMoreMsgElement, learnMoreElement];
    }

    static composeChooseStoreElements() {
        let chooseStoreMsgElement = TemplateBuilder.buildTextMessage('Swipe ➡ through the options below 👇');
        
        let metroManila = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/tru-resources/Chatbot%20Pictures/places/manila.jpg", 6, 5, true, "none", "Find stores in Metro Manila", "METRO MANILA", 6, 1, false, "reply", "POSTBACK|METRO MANILA|Metro Manila");
        
        let luzon = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/tru-resources/Chatbot%20Pictures/places/luzon.jpg", 6, 5, true, "none", "Find stores in Luzon", "LUZON", 6, 1, false, "reply", "POSTBACK|LUZON|Luzon");
        
        let visMin = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/tru-resources/Chatbot%20Pictures/places/visayas.jpg", 6, 5, true, "none", "Find stores in Visayas and Mindanao", "VISAYAS & MINDANAO", 6, 1, false, "reply", "POSTBACK|VISMIN|VisMin");
        
        const cards = [metroManila[0], metroManila[1], metroManila[2], luzon[0], luzon[1], luzon[2], visMin[0], visMin[1], visMin[2]];

        
        let chooseStoreBuild = TemplateBuilder.buildJsonTemplate(6, 7, cards);
        let chooseStoreElement = TemplateBuilder.buildRichMediaMessage(chooseStoreBuild);

        return [chooseStoreMsgElement, chooseStoreElement];
    }

    static async composeStoreElement(payload) {
        let storeElement = await StoreData.getStoreElement(payload);

        return storeElement;
    }


    static composeErrorMsgElements() {
        let errorText = "Hey! 👋 Thanks for reaching out. Let us know if you want to talk to our personal shopper 🛍️ for more assistance, or you can give us a call at 0917111TOYS (09171118697). 📲";
        let errorTextElement = TemplateBuilder.buildTextTemplate(errorText, 6, 6);
        let errorQuickReplies1 = TemplateBuilder.buildButtonTemplate("Talk to Shopper" ,6, 1, true, "open-url", "viber://chat?number=%2B639171118697");
        
        const cards = [errorTextElement, errorQuickReplies1];

        
        let errorMsgBuild = TemplateBuilder.buildJsonTemplate(6, 7, cards);
        let errorMsgElement = TemplateBuilder.buildRichMediaMessage(errorMsgBuild);

        return [errorMsgElement];
    }
    
    static composeHandoffMsg(payload) {
        let handoffMsg = Factory.getHandOffDialogue(payload);

        return handoffMsg;
    }

    static composeConfirmHandoffMsg() {
        let confirmHandoffMsg1 = TemplateBuilder.buildTextMessage("Our personal shopper has been notified. Kindly wait for a moment as we connect you to them.");
        let confirmHandoffMsg2 = TemplateBuilder.buildTextMessage("Welcome! I'm your personal shopper for today. How may I help you?");


        return [confirmHandoffMsg1, confirmHandoffMsg2];
    }

    static composeExitQuietModeMsg() {
        let exitQuietModeMsg = TemplateBuilder.buildTextTemplate("Are you sure you want quit talking to our personal shopper?", 6, 6);
        let exitConfirm = TemplateBuilder.buildButtonTemplate("Confirm", 3, 1, true, "reply", "POSTBACK|CONFIRM_EXIT|Confirm");
        let exitCancel = TemplateBuilder.buildButtonTemplate("Cancel", 3, 1, true, "reply", "POSTBACK|CANCEL_EXIT|Exit");

        const cards = [exitQuietModeMsg, exitConfirm, exitCancel];
        let handOffDialogueBuild = TemplateBuilder.buildJsonTemplate(6, 7, cards);
        let handOffDialogueElement = TemplateBuilder.buildRichMediaMessage(handOffDialogueBuild);
        

        return handOffDialogueElement;
    }

    static composeConfirmExitQuietModeMsg() {
        let msg = TemplateBuilder.buildTextMessage("You are now disconnected from our personal shopper. Please don't hesitate to contact again if you need assistance.");

        return msg;
    }

    static composeCancelExitQuietModeMsg() {
        let msg = TemplateBuilder.buildTextMessage("Alright, our personal shopper is still with you.");

        return msg;
    }


}