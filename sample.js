
const projectId = "resistossistance-12243";
const sessionId = '123456';
const queries = "give me color code for 22 kilo ohm";
const languageCode = "en";

// Imports the Dialogflow library
const dialogflow = require("dialogflow");

// Instantiates a session client
const sessionClient = new dialogflow.SessionsClient({
    "keyFilename":"Resistossistance-e6b8f5164f65.json"
});

async function detectIntent(
  projectId,
  sessionId,
  query,
  contexts,
  languageCode
) {
  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode
      }
    }
  };

  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts: contexts
    };
  }

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}

async function executeQueries(projectId, sessionId, query, languageCode) {
  // Keeping the context across queries let's us simulate an ongoing conversation with the bot
  let context;
  let intentResponse;
  try {
    console.log(`Sending Query: ${query}`);
    intentResponse = await detectIntent(
      projectId,
      sessionId,
      query,
      context,
      languageCode
    );
    console.log("Detected intent");
    console.log(
      `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
    );
    // Use the context from this response for next queries
    context = intentResponse.queryResult.outputContexts;
  } catch (error) {
    console.log(error);
  }

} 

executeQueries(projectId, sessionId, queries, languageCode);
