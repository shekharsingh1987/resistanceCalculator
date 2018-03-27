
var apiai = require('apiai');
var apiApp = apiai("502a8828a2ba4179abe9b9f55ec85d6d");
var getSessionId = function (session) {    
    if(!session){
        return "0d6036e2370c4cb59ba989763c69d1aa";
    }else{
        return session;
    }
}


var apiaiRequest = {
    process: function (req, cb_result, cb_error) {
        var request = apiApp.textRequest(req.body.textMessage, {
            sessionId: getSessionId(req.body.sessionId)
        });

        request.on('response', function (response) {
            return cb_result(response.result);
        });

        request.on('error', function (error) {
            return cb_error(error);
        });
        request.end();
    }
};
module.exports = apiaiRequest; 
