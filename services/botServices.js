
const dialogflow = require("dialogflow");
const uuid = require("uuid");

const projectId = "resistossistance-12243";
const languageCode = "en-US";

var apiaiRequest = {
  process: function(req, cb_result, cb_error) {
    const sessionId = uuid.v4();
    const sessionClient = new dialogflow.SessionsClient({
      "keyFilename":"Resistossistance-e6b8f5164f65.json"
    });
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
