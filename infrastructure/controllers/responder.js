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

    static genHandoffSequence(user, payload) {
        await StoreData.updateCurrentSession(user, payload);
    }

}