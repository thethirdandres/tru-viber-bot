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

        let handOffDialogue = new CarouselComposer('#D3D3D3', 7);
        handOffDialogue.addCarouselElement(TemplateBuilder.genHandoffMsg(contact_number, business_name))
        
        return handOffDialogue.build();
    }
}