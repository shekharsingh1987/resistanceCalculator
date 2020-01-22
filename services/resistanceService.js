
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


var GetUnitMultiplier = function (suffix) {
    var key = suffix.toLowerCase();
    var multiplierArray = {
        "kilo": 1000,
        "mega": 1000000,
        "giga": 1000000000
    }
    return multiplierArray[key];
}

var GetColorCodeDigitForBand = function (input, band) {
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

var GetColorCodeFromValue = function (input) {
    if (input) {
        var responseResistance = input.split(',');
        var resistanceValue = parseFloat(responseResistance[0]);


        if (responseResistance.length > 1) {
            var multiplier = GetUnitMultiplier(responseResistance[1]);
            var completeResistanseValue = resistanceValue * multiplier;
            //Find the color code.
            var resitanceValueCharacterArray = completeResistanseValue.toString().split('');
            var restValLength = resitanceValueCharacterArray.length;

            //Logic for Band 4
            var significantLength = restValLength - 2;
            if (significantLength == -1) {
                //ToDo: Add the logic if the resistance value is small and the length of 2
                var colorBand_4 = "Black";
                var element = resitanceValueCharacterArray[0]
                var colorTableObject = colorCodeDataHelper.GetColorBandNameByValue(element);
                colorBand_4 += "," + colorTableObject.name + ",Black";
                return colorBand_4;
            }
            else if (significantLength >= 0 && significantLength <= 9) {
                var colorBand_4 = "";
                for (let index = 0; index < 2; index++) {
                    const element = resitanceValueCharacterArray[index];
                    var colorTableObject = colorCodeDataHelper.GetColorBandNameByValue(element);
                    colorBand_4 += "," + colorTableObject.name;
                }
                var colorTableObjectForSignificant = colorCodeDataHelper.GetColorBandNameByValue(significantLength);
                colorBand_4 += "," + colorTableObjectForSignificant.name;

                if (colorBand_4.charAt(0) == ",") {
                    colorBand_4 = colorBand_4.substring(1)
                }
                return colorBand_4;
            }
            else{
                return "";
            }

            //ToDo: Logic for Band 5

        }

    }
}




var getResistance = function (band, input, cb_response) {

    switch (band[0]) {
        case "ResistorBand":
            var resistossistance = GetColorCodeDigitForBand(input, parseInt(band[1]));
            cb_response({ "success": true, "content": resistossistance, "band": band[1] });
        case "ResistorColorCode":
            var colorBands = GetColorCodeFromValue(input)
            cb_response({ "success": true, "content": colorBands, "band": "4" });

        default:
            break;
    }
}

var resitanceHelper = {
    GetResistance: function (req, res) {
        botService.process(req, function (aiResult) {
            console.log(aiResult);
            if (aiResult.fulfillmentText) {
                var band = aiResult.intent.split('_');
                if (band.length > 1) {
                    getResistance(band, aiResult.fulfillmentText, function (jsonResponse) {
                        res.json(jsonResponse);
                    });
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