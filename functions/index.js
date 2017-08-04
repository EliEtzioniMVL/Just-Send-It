'use strict';

const functions = require('firebase-functions');
const twilio = require('twilio');
const config = require('./config.json');

const MessagingResponse = twilio.twiml.MessagingResponse;
const projectId = process.env.GCLOUD_PROJECT;
const region = 'us-central1';

//require the Twilio module and create a REST client 
var client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

exports.reply = functions.https.onRequest((req, res) => {
  let isValid = true;

  // Only validate that requests came from Twilio when the function has been
  // deployed to production.
  if (process.env.NODE_ENV === 'production') {
    isValid = twilio.validateExpressRequest(req, config.TWILIO_AUTH_TOKEN, {
      url: `https://${region}-${projectId}.cloudfunctions.net/reply`
    });
  }

  // Halt early if the request was not sent from Twilio
  if (!isValid) {
    res
      .type('text/plain')
      .status(403)
      .send('Twilio Request Validation Failed.')
      .end();
    return;
  }

  // Prepare a response to the SMS message
  const response = new MessagingResponse();

  // Add text to the response
  response.message('Hello from Google Cloud Functions!');

  // Send the response
  res
    .status(200)
    .type('text/xml')
    .end(response.toString());
});

// Take the text parameter passed to this HTTP endpoint and insert it into the
exports.addMessage = functions.database.ref('/users/{userId}').onWrite((event) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = event.data.val();
    console.log("username " + original["username"]);
    console.log("telephone " + original["telephone"]);

    client.messages.create({ 
        to: "+1" + original["telephone"],
        from: "+12062025653",
        body: original["username"] + ", Thanks for joining!"  
    }, function(err, message) { 
        console.log(message.sid); 
    });
});
