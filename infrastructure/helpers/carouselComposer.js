
'use strict';

function CarouselComposer(bgColor, row) {
    this.elements = [];
    this.bgColor = bgColor;
    this.row = row;
}

CarouselComposer.prototype.addCarouselElement = function(element) {
    this.elements = this.elements.concat(element);
}

CarouselComposer.prototype.build = function() {
    return {
        'ButtonsGroupColumns': 6,
        'ButtonsGroupRows': this.row,
        'BgColor': this.BgColor,
        'Buttons': this.elements
    };
}


module.exports = CarouselComposer;  