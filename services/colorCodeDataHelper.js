
var colorDataTable = require('./colorTableData');

var colorCodeDataHelper = {
    GetColorStandardDigitValue: function (color) {
        var colorDataObject = colorDataTable.GetColorCodeTable();
        for (var c = 0; c < colorDataObject.length; c++) {
            if (colorDataObject[c].name.toLowerCase() === color.toLowerCase()) {
                return colorDataObject[c];
            }
        }
    },
    GetColorCodeTable: function () {
        return colorDataTable.GetColorCodeTable();
    },
    GetColorBandNameByValue: function(value){
        var colorDataObject = colorDataTable.GetColorCodeTable();
        for (var c = 0; c < colorDataObject.length; c++) {
            if (colorDataObject[c].value === value) {
                return colorDataObject[c];
            }
        }
    }
}

module.exports = colorCodeDataHelper;
