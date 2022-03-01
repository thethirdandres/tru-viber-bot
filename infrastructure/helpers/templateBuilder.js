'use strict'

const KeyboardMessage = require('viber-bot').Message.Keyboard;
const TextMessage = require('viber-bot').Message.Text;
const RichMediaMessage = require('viber-bot').Message.RichMedia;

module.exports = class TemplateBuilder {
    static buildTextMessage(message) {
        return new TextMessage(message);
    }

    static buildRichMediaMessage(element) {
        return new RichMediaMessage(element);
    }

    static buildKeyboard(keyboard_params) {
        return new KeyboardMessage(keyboard_params, null, null, null, 6);
    }

    static buildJsonTemplate(buttonsGroupColumns, buttonsGroupRows, elements) {
        return {
            'ButtonsGroupColumns': buttonsGroupColumns,
            'ButtonsGroupRows': buttonsGroupRows,
            'BgColor': '#565656',
            'Buttons': elements
        }
    }

    static buildButtonTemplate(text, columns, rows, isSilent, actionType, actionBody) {
        return {
                'Columns': columns,
                'Rows': rows,
                'Silent': isSilent,
                'Text': `<b><font color=\'#191970\'>${text}</font></b>`,
                'TextSize': 'medium',
                'TextHAlign': 'center',
                'TextVAlign': 'middle',
                'ActionType': actionType,
                'ActionBody': actionBody,
                'BgColor': '#D3D3D3'
        }
    }
    
    static buildTextTemplate(text, columns, rows) {
        return {
            'Columns': columns,
            'Rows': rows,
            'Text': `<font color=\'#FFFFFF\'>${text}</font>`,
            'BgColor': "#3f4c5c",
            'ActionType': 'none',
            'TextSize': 'large',
            'TextVAlign': 'middle',
            'TextHAlign': 'center'
        }
    }

    static buildImageTemplate(imageUrl, columns, rows, isSilent, actionType) {
        return {
            'Columns': columns,
            'Rows': rows,
            'Silent': isSilent,
            'ActionType': actionType,
            'Image': imageUrl
        }
    }

    static buildTitleTemplate(title) {
        return {
            'Columns': 6,
            'Rows': 1,
            'Text': `<font color=#323232><b>${title}</b></font><br>`,
            'ActionType': 'none',
            'TextSize': 'large',
            'TextVAlign': 'middle',
            'TextHAlign': 'center'
        }
    }

    static buildTextButtonTemplate(text, columns, rows, buttontext, buttoncolumns, buttonrows, isSilent, actionType, actionBody) {
        return [
            this.buildTextTemplate(text, columns, rows), 
            this.buildButtonTemplate(buttontext, buttoncolumns, buttonrows, isSilent, actionType, actionBody)
        ]
    }

    static buildImageTitleButtonTemplate(imageUrl, columns, rows, isSilent, actionType, title, text, buttoncolumns, buttonrows, buttonisSilent, buttonactionType, buttonactionBody) {
        return [
            this.buildImageTemplate(imageUrl, columns, rows, isSilent, actionType),
            this.buildTitleTemplate(title),
            this.buildButtonTemplate(text, buttoncolumns, buttonrows, buttonisSilent, buttonactionType, buttonactionBody)
        ]
    }
    
    static genKeyboardTemplate() {
        return {
            "Type": "keyboard",
            "InputFieldState": "hidden",
            "Buttons": [
                {
                    "Columns": 2,
                    "Rows": 1,
                    "Silent": true,
                    "ActionType": "none",
                    "BgColor": "#da251c",
                },
                {
                    "Columns": 1,
                    "Rows": 1,
                    "Silent": true,
                    "ActionType": "reply",
                    "ActionBody": "Main Menu",
                    "Image": "https://storage.googleapis.com/avigate-img-resources/keyboard_buttons/Menu.jpg",
                    "ImageScaleType": "fill"
                },
                {
                    "Columns": 1,
                    "Rows": 1,
                    "Silent": true,
                    "ActionType": "reply",
                    "ActionBody": "Learn More",
                    "Image": "https://storage.googleapis.com/avigate-img-resources/keyboard_buttons/Learn.jpg",
                    "ImageScaleType": "fill"
                },
                {
                    "Columns": 2,
                    "Rows": 1,
                    "Silent": true,
                    "ActionType": "none",
                    "BgColor": "#da251c",
                },
            ]
        };
    }

    static genHandoffMsg(contact_number, chatbot_store_name) {
        return [
            this.buildTextTemplate(`You will be redirected to ${chatbot_store_name}'s Personal Shopper. Continue?`, 6, 6),
            this.buildButtonTemplate("Confirm", 3, 1, true, "open-url", `viber://chat?number=%2B${contact_number}`),
            this.buildButtonTemplate("Main Menu", 3, 1, false, "reply", `Main Menu`)
        ]
    }
    
}