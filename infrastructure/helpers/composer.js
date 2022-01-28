'use strict'

const TemplateBuilder = require('./templateBuilder');
const Factory = require('./factory');
const Helper = require('./helper');


module.exports = class Composer {
    static composeKeyboardElements() {
        return TemplateBuilder.buildKeyboard(TemplateBuilder.genKeyboardTemplate());
    }

    static composeGetStartedButtonElements() {
        let getStartedButtonRaw = TemplateBuilder.buildButtonTemplate("Get started", 6, 1, false, "reply", "Get started");
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
        
        let asImage = TemplateBuilder.buildImageTemplate("https://storage.googleapis.com/avigate-img-resources/tru-resources/CSP-Hotline.jpg", 6, 4, true, "none");
        let asTitle = TemplateBuilder.buildTitleTemplate("Assisted Shopping");
        let asButtons1 = TemplateBuilder.buildButtonTemplate("Call 0917111TOYS", 6, 1, true, "open-url", "viber://chat?number=%2B639171118697");
        let asButtons2 = TemplateBuilder.buildButtonTemplate("Choose store", 6, 1, false, "reply", "Choose store");

        let rob = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/tru-resources/GoR-shop-online-button_1%20(1005).jpg", 6, 5, true, "none", "GoRobinsons", "Shop at GoRobinsons", 6, 1, true, "open-url", "https://toysrus.gorobinsons.ph");
        
        let slImage = TemplateBuilder.buildImageTemplate("https://storage.googleapis.com/avigate-img-resources/tru-resources/laz-shopee_3%20(1005).jpg", 6, 4, true, "none");
        let slTitle = TemplateBuilder.buildTitleTemplate("Shop at our online stores");
        let slButtons1 = TemplateBuilder.buildButtonTemplate("Lazada", 6, 1, true, "open-url", "https://www.lazada.com.ph/shop/toys-r-us");
        let slButtons2 = TemplateBuilder.buildButtonTemplate("Shopee", 6, 1, false, "open-url", "https://shopee.ph/toysrusph");

        const cards = [asImage, asTitle, asButtons1, asButtons2, rob[0], rob[1], rob[2], slImage, slTitle, slButtons1, slButtons2];


        let mainMenuElementBuild = TemplateBuilder.buildJsonTemplate(6, 7, cards);
        let mainMenuElement = TemplateBuilder.buildRichMediaMessage(mainMenuElementBuild);

        return [mainMenuMsgElement, mainMenuElement];
    }

    static composeLearnMoreElements() {
        let learnMoreMsgElement = TemplateBuilder.buildTextMessage('Sure! 👍 What would you like to learn more about?');

        let promosEvents = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/tru-resources/Spooktacular-Halloween%20(1019).jpg", 6, 5, true, "none", "Promos and Events", "Select", 6, 1, true, "open-url", "https://toysrus.com.ph/promos/virtualhalloween");
        let howShopPlay = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/tru-resources/CSP-HowItWorks%20(1019).jpg", 6, 5, true, "none","How to Call Shop Play?", "Select", 6, 1, true, "open-url", "https://toysrus.com.ph/callshopplay");
        let returnExchange = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/tru-resources/Return-and-Exchange%20(1019).jpg", 6, 5, true, "none","Return and Exchange Policy", "Select", 6, 1, true, "open-url", "https://toysrus.com.ph/services");
        const cards = [learnMoreMsgElement, promosEvents[0], promosEvents[1], promosEvents[2], howShopPlay[0], howShopPlay[1], howShopPlay[2], returnExchange[0], returnExchange[1], returnExchange[2]];


        let learnMoreBuild = TemplateBuilder.buildJsonTemplate(6, 7, cards);
        let learnMoreElement = TemplateBuilder.buildRichMediaMessage(learnMoreBuild);

        return learnMoreElement;
    }


// ========================================================================










    static composeErrorMsgElements() {
        let errorText = "Hey there! 👋 Thanks for reaching out; we're here to help you with your shopping inquiries. 😊 Let us know if you want to talk to our personal shopper 🛍 or you can call us at 0917LOVEROB (09175683762) 📲 \n\n If you want to check out your options, click on \"Main Menu\" 👇";
        let errorTextElement = TemplateBuilder.buildTextTemplate(errorText, 6, 6);
        let errorQuickReplies1 = TemplateBuilder.buildButtonTemplate("Talk to Shopper" ,3, 1, true, "open-url", "viber://chat?number=%2B639175683762");
        let errorQuickReplies2 = TemplateBuilder.buildButtonTemplate("Main Menu", 3, 1, false, "reply", "Main Menu");
        
        const cards = [errorTextElement, errorQuickReplies1, errorQuickReplies2];

        
        let errorMsgBuild = TemplateBuilder.buildJsonTemplate(6, 7, cards);
        let errorMsgElement = TemplateBuilder.buildRichMediaMessage(errorMsgBuild);

        return [errorMsgElement];
    }
    
    static composeChooseStoreElements() {
        let chooseStoreMsgElement = TemplateBuilder.buildTextMessage('Swipe ➡ through the options below 👇');
        
        let metroManila = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/general/img_metromanila.jpg", 6, 5, true, "none", "Find stores in Metro Manila", "Metro Manila", 6, 1, false, "reply", "Metro Manila");
        
        let northLuzon = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/general/img_northluzon.jpg", 6, 5, true, "none", "Find stores in North Luzon", "North Luzon", 6, 1, false, "reply", "North Luzon");
        
        let southLuzon = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/general/img_southluzon.jpg", 6, 5, true, "none", "Find stores in South Luzon", "South Luzon", 6, 1, false, "reply", "South Luzon");
        
        let visayas = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/general/img_visayas.jpg",  6, 5, true, "none", "Find stores in Visayas", "Visayas", 6, 1, false, "reply", "Visayas");
        
        let mindanao = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/general/img_mindanao.jpg",  6, 5, true, "none","Find stores in Mindanao", "Mindanao", 6, 1, false, "reply", "Mindanao");
        
        // const cards = [metroManila[0], metroManila[1], metroManila[2], northLuzon[0], northLuzon[1], northLuzon[2], southLuzon[0], southLuzon[1], southLuzon[2]];
        const cards = [metroManila[0], metroManila[1], metroManila[2], northLuzon[0], northLuzon[1], northLuzon[2], southLuzon[0], southLuzon[1], southLuzon[2], visayas[0], visayas[1], visayas[2], mindanao[0], mindanao[1], mindanao[2]];

        
        let chooseStoreBuild = TemplateBuilder.buildJsonTemplate(6, 7, cards);
        let chooseStoreElement = TemplateBuilder.buildRichMediaMessage(chooseStoreBuild);

        return [chooseStoreMsgElement, chooseStoreElement];
    }

    

    static composeShopOnlineElements() {
        let goRob = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/general/GoRobinsons%20Chatbot.jpg", 6, 5, true, "none", "GoRobinsons", "Shop at GoRobinsons", 6, 1, true,  "open-url", "https://departmentstore.gorobinsons.ph/");
        let sho = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/general/Shopee-chatbot.png", 6, 5, true, "none", "Shopee", "Shop at Shopee", 6, 1, true, "open-url", "https://shopee.ph/robinsons_department_store?utm_source=messenger&utm_medium=chatbot&utm_campaign=shopee");
        let lazMall = TemplateBuilder.buildImageTitleButtonTemplate("https://storage.googleapis.com/avigate-img-resources/general/img_shoponline.jpg", 6, 5, true, "none", "Lazada", "Shop at Lazada", 6, 1, true, "open-url", "https://www.lazada.com.ph/shop/robinsons-department-store");

        const cards = [goRob[0], goRob[1], goRob[2], sho[0], sho[1], sho[2], lazMall[0], lazMall[1], lazMall[2],];


        let shopOnlineBuild = TemplateBuilder.buildJsonTemplate(6, 7, cards);
        let shopOnlineElement = TemplateBuilder.buildRichMediaMessage(shopOnlineBuild);

        return shopOnlineElement;
    }
    
    static composeHandoffMsg(payload) {
        let handoffMsg = TemplateBuilder.buildRichMediaMessage(Factory.getHandOffDialogue(payload));

        return handoffMsg;
    }

    static async composeStoreElement(payload) {
        let storeElementBuild = await Helper.getStoreElement(payload);
        let storeElement = TemplateBuilder.buildRichMediaMessage(storeElementBuild);

        return storeElement;
    }

}