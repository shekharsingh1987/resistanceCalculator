
var express = require('express');

module.exports = function () {
    var router = express.Router();
    var resistanceService = require('../services/resistanceService');

    router.get('/api/v1/resistance/get', function(req,res){
        res.send('Successfully hit');
    });


    return router;
}