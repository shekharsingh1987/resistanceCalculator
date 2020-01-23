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

const dialogflow = require("dialogflow");
const uuid = require("uuid");

const projectId = "306d73e591d14a7e944ea92feaf65945";
const languageCode = "en-US";

var apiaiRequest = {
  process: function(req, cb_result, cb_error) {
    const sessionId = uuid.v4();
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: req.body.textMessage,
          languageCode: languageCode
        }
      }
    };

    // Send request and log result
    //const responses = sessionClient.detectIntent(request);

    sessionClient.detectIntent(request).then(responses => {
      console.log(responses);
      const result = responses[0].queryResult;
      if (result.intent) {
        return cb_result(result);
      } else {
        return cb_error("No-Intent Matched!");
      }
    });    
  }
};

module.exports = apiaiRequest;
