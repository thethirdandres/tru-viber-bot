'use strict'

const Composer = require('../helpers/composer');
const StoreData = require('../repositories/storeData');

module.exports = class Responder {
    static genKeyboardElements() {
        return Composer.composeKeyboardElements();
    }

    static genErrorMsgElements() {
        let errorMsgElements =  Composer.composeErrorMsgElements();

        return [errorMsgElements];
    }

    static genGetStartedButtonElements() {
        let getStartedButtonElements = Composer.composeGetStartedButtonElements();
        return getStartedButtonElements;
    }

    static genGetStartedMsgElements() {
        let getStartedMsgElements = Composer.composeGetStartedMsgElements();
        let mainMenuElements = Composer.composeMainMenuElements();

        let welcomeMsgElement = getStartedMsgElements[0];
        let privacyPolicyElement = getStartedMsgElements[1];
        let mainMenuMsgElement = mainMenuElements[0];
        let mainMenuElement = mainMenuElements[1];

        return [welcomeMsgElement, privacyPolicyElement, mainMenuMsgElement, mainMenuElement];
    }

    static genMainMenuElements() {
        let mainMenuElements = Composer.composeMainMenuElements();

        let mainMenuMsgElement = mainMenuElements[0];
        let mainMenuElement = mainMenuElements[1];

        return [mainMenuMsgElement, mainMenuElement];
    }

    static genLearnMoreElements() {
        let learnMoreElement = Composer.composeLearnMoreElements();

        return [learnMoreElement];
    }
    
    static genChooseStoreElements() {
        let chooseStoreMsgElements = Composer.composeChooseStoreElements();

        return [chooseStoreMsgElements];
    }


    static async genStoreElements(payload) {
        let storeElement = await Composer.composeStoreElement(payload);

        return [storeElement];
    }

    static genHandoffMsg(payload) {
        let handoffMsg = Composer.composeHandoffMsg(payload);

        return [handoffMsg];
    }

    static async genHandoffSequence(user, payload) {
        let payload_tokens = payload.split(" ");
        // let contact_number = payload_tokens[1];
        // let parent_id = payload_tokens[2];
        let doc_id = payload_tokens[2];
        // let chatbot_store_name_raw = payload_tokens.splice(4).join(" ");
        // let chatbot_store_name = Helper.lowerCaseAllWordsExceptFirstLetters(chatbot_store_name_raw);

        await StoreData.updateCurrentSession(user, doc_id);

        let confirmHandoffMsg = Composer.composeConfirmHandoffMsg();

        return confirmHandoffMsg;
    }

    static async genExitQuietModeMsg() {
        let exitQuietModeMsg = await Composer.composeExitQuietModeMsg();

        return [exitQuietModeMsg];
    }

    static async genConfirmExitQuietModeMsg() {
        let confirmExitQuietModeMsg = await Composer.composeConfirmExitQuietModeMsg();

        return [confirmExitQuietModeMsg];
    }

    static async genCancelExitQuietModeMsg() {
        let msg = await Composer.composeCancelExitQuietModeMsg();

        return [msg];
    }
}