
'use strict';

function CarouselContentGenerator(backgroundColor) {
    this.backgroundColor = backgroundColor;
    this.elements = [];
}

CarouselContentGenerator.prototype.elementToCarouselJSON = function(title, imageUrl, callToAction, actionType, actionBody, isSilent) {
    return [{
        'Columns': 6,
        'Rows': 5,
        'Silent': isSilent,
        'ActionType': 'none',
        'Image': imageUrl
    }, {
        'Columns': 6,
        'Rows': 1,
        'Text': `<font color=#323232><b>${title}</b></font><br>`,
        'Silent': isSilent,
        'ActionType': 'none',
        'TextSize': 'large',
        'TextVAlign': 'middle',
        'TextHAlign': 'center'
    }, {
        'Columns': 6,
        'Rows': 1,
        'Silent': isSilent,
        'Text': `<b><font color=\'#191970\'>${callToAction}</b></font>`,
        'TextSize': 'medium',
        'TextHAlign': 'center',
        'TextVAlign': 'middle',
        'ActionType': actionType,
        'ActionBody': actionBody,
        'BgColor': '#D3D3D3'
    }];
}

CarouselContentGenerator.prototype.elementToCarouselJSON_Subtitle = function(title, subtitle, imageUrl, callToAction, actionType, actionBody, isSilent) {
    return [{
        'Columns': 6,
        'Rows': 4,
        'Silent': isSilent,
        'ActionType': 'none',
        'Image': imageUrl
    }, {
        'Columns': 6,
        'Rows': 2,
        'Text': `<font color=#323232><b>${title}</b></font><br><font color=#777777>${subtitle}</font>`,
        'Silent': isSilent,
        'ActionType': 'none',
        'TextSize': 'medium',
        'TextVAlign': 'middle',
        'TextHAlign': 'center'
    }, {
        'Columns': 6,
        'Rows': 1,
        'Silent': isSilent,
        'Text': `<b><font color=\'#191970\'>${callToAction}</b></font>`,
        'TextSize': 'large',
        'TextHAlign': 'center',
        'TextVAlign': 'middle',
        'ActionType': actionType,
        'ActionBody': actionBody,
        'BgColor': '#D3D3D3'
    }];
}

CarouselContentGenerator.prototype.elementToCarouselJSON_Store= function(store1, store2, store3, store4, store5, store6, store7) {
    return [
        {
            'Columns': 6,
            'Rows': 1,
            'Silent': true,
            'Text': `<b><font color=\'#191970\'>${store1}</font></b>`,
            'TextSize': 'small',
            'TextHAlign': 'center',
            'TextVAlign': 'middle',
            'ActionType': 'open-url',
            'ActionBody': 'viber://chat?number=639774502860',
            'BgColor': '#D3D3D3'
        },
        {
            'Columns': 6,
            'Rows': 1,
            'Silent': true,
            'Text': `<b><font color=\'#191970\'>${store2}</font></b>`,
            'TextSize': 'small',
            'TextHAlign': 'center',
            'TextVAlign': 'middle',
            'ActionType': 'open-url',
            'ActionBody': 'viber://chat?number=639774502860',
            'BgColor': '#D3D3D3'
        },
        {
            'Columns': 6,
            'Rows': 1,
            'Silent': true,
            'Text': `<b><font color=\'#191970\'>${store3}</font></b>`,
            'TextSize': 'small',
            'TextHAlign': 'center',
            'TextVAlign': 'middle',
            'ActionType': 'open-url',
            'ActionBody': 'viber://chat?number=639774502860',
            'BgColor': '#D3D3D3'
        },
        {
            'Columns': 6,
            'Rows': 1,
            'Silent': true,
            'Text': `<b><font color=\'#191970\'>${store4}</font></b>`,
            'TextSize': 'small',
            'TextHAlign': 'center',
            'TextVAlign': 'middle',
            'ActionType': 'open-url',
            'ActionBody': 'viber://chat?number=639774502860',
            'BgColor': '#D3D3D3'
        },
        {
            'Columns': 6,
            'Rows': 1,
            'Silent': true,
            'Text': `<b><font color=\'#191970\'>${store5}</font></b>`,
            'TextSize': 'small',
            'TextHAlign': 'center',
            'TextVAlign': 'middle',
            'ActionType': 'open-url',
            'ActionBody': 'viber://chat?number=639774502860',
            'BgColor': '#D3D3D3'
        },
        {
            'Columns': 6,
            'Rows': 1,
            'Silent': true,
            'Text': `<b><font color=\'#191970\'>${store6}</font></b>`,
            'TextSize': 'small',
            'TextHAlign': 'center',
            'TextVAlign': 'middle',
            'ActionType': 'open-url',
            'ActionBody': 'viber://chat?number=639774502860',
            'BgColor': '#D3D3D3'
        },
        {
            'Columns': 6,
            'Rows': 1,
            'Silent': true,
            'Text': `<b><font color=\'#191970\'>${store7}</font></b>`,
            'TextSize': 'small',
            'TextHAlign': 'center',
            'TextVAlign': 'middle',
            'ActionType': 'open-url',
            'ActionBody': 'viber://chat?number=639774502860',
            'BgColor': '#D3D3D3'
        }
    ]
}


CarouselContentGenerator.prototype.addCarouselElement = function(title, imageUrl, callToAction, actionType,  actionBody, isSilent) {
    let addedElements = this.elementToCarouselJSON(title, imageUrl, callToAction, actionType, actionBody, isSilent);

    this.elements = this.elements.concat(addedElements);
}

CarouselContentGenerator.prototype.addCarouselElement_Subtitle = function(title, subtitle, imageUrl, callToAction, actionType, actionBody, isSilent) {
    let addedElements = this.elementToCarouselJSON_Subtitle(title, subtitle, imageUrl, callToAction, actionType, actionBody, isSilent);

    this.elements = this.elements.concat(addedElements);
}

CarouselContentGenerator.prototype.addCarouselElement_Store = function(store1, store2, store3, store4, store5, store6, store7) {
    let addedElements = this.elementToCarouselJSON_Store(store1, store2, store3, store4, store5, store6, store7);

    this.elements = this.elements.concat(addedElements);
}

CarouselContentGenerator.prototype.build = function() {
    return {
        'ButtonsGroupColumns': 6,
        'ButtonsGroupRows': 7,
        'BgColor': this.backgroundColor,
        'Buttons': this.elements
    };
}

module.exports = CarouselContentGenerator;
