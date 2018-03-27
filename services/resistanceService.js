
var botService = require('./botServices');
var colorCodeDataHelper = require('./colorCodeDataHelper');

var ConvertToUnit = function (rValue) {
    if (Math.floor(rValue / (1000000)) > 0) {
        return (rValue / (1000000)) + " M Ohm";
    }
    else if (Math.floor(rValue / 1000) > 0) {
        return (rValue / 1000) + " K Ohm";
    }
    else {
        return (rValue) + " Ohm";
    }
}

var GetColorCodeDigitForBand_4 = function (input, band) {
    var colorArray = input.split(',');
    
    var significantValueString = "";
    var multiplier = 0;
    var tolerenceValue = "";

    for (var ca = 0; ca < colorArray.length; ca++) {
        if (colorArray[ca]) {
            var colorValue = colorCodeDataHelper.GetColorStandardDigitValue(colorArray[ca]);
            if (colorValue) {                
                if (ca < (band - 2)) {
                    significantValueString += colorValue.value.toString();
                }
                else if (ca == (band - 2)) {
                    multiplier = colorValue.multiplier;
                }
                else if (ca == (band - 1)) {
                    tolerenceValue = colorValue.tolerence.toString() + "%";
                }
            }
            else {
                return " Please use correct band color";
            }
        }
    }
    var significantValue = parseInt(significantValueString) * multiplier;
    var resistance = ConvertToUnit(significantValue);

    return resistance + " " + tolerenceValue;
}

var getResistance = function (bandType, input) {
    return GetColorCodeDigitForBand_4(input, parseInt(bandType));
}

var resitanceHelper = {
    GetResistance: function (req, res) {
        botService.process(req, function (aiResult) {

            if (aiResult.fulfillment.speech) {
                var band = aiResult.metadata.intentName.split('_');
                if (band.length > 1) {
                    var resistossistance = getResistance(band[1], aiResult.fulfillment.speech)
                    res.json({ "success": true, "content": resistossistance, "band": band[1] });
                }
                else {
                    res.json({ "success": false, content: "We couldn't understand intent,Please try again saying in correct format." });
                }
            } else {
                res.json({ "success": false, content: "Please try again saying in correct format." });
            }
        }, function (error) {
            res.json({ "success": false, content: error });
        });
    }
};
module.exports = resitanceHelper;