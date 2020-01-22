
/* Legacy Code Used Api.Ai 

var apiai = require('apiai');

var apiApp = apiai("306d73e591d14a7e944ea92feaf65945");
var getSessionId = function (session) {    
    if(!session){
        return uuid.v4();
    }else{
        return session;
    }
}
*/

const dialogflow = require('dialogflow');
const uuid = require('uuid');
const projectId = '306d73e591d14a7e944ea92feaf65945';
const sessionId = uuid.v4();
const languageCode = 'en-US';

var apiaiRequest = {
    process: function (req, cb_result, cb_error) {

        const sessionClient = new dialogflow.SessionsClient();
        const sessionPath = sessionClient.sessionPath(projectId, sessionId);

        // The text query request.
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: req.body.textMessage,
                    languageCode: 'en-US',
                },
            },
        };

        // Send request and log result
        const responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        const result = responses[0].queryResult;
        console.log(result);
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);


        if (result.intent) {
            return cb_result(responses[0].queryResult);
        } else {
            return cb_error('No-Intent Matched!');
        }

        // var request = apiApp.textRequest(req.body.textMessage, {
        //     sessionId: getSessionId(req.body.sessionId)
        // });

        // request.on('response', function (response) {
        //     return cb_result(response.result);
        // });

        // request.on('error', function (error) {
        //     return cb_error(error);
        // });
        // request.end();
    }
};

module.exports = apiaiRequest; 
