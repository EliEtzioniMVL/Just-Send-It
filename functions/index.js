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

// Sends a welcome message when a user signs up and is added to users.
exports.welcomeMessage = functions.database.ref('/users/{userId}').onWrite((event) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = event.data.val();

    client.messages.create({ 
        to: "+1" + original["telephone"],
        from: "+12062025653",
        body: original["username"] + ", Thanks for joining Just Send It! If you ever want to unsubscribe just text this number with the message unsubscribe."  
    }, function(err, message) { 
        console.log(message.sid); 
    });
});

// Sends an event message when a new event is added to events.
exports.eventMessage = functions.database.ref('/events/{eventId}').onWrite((event) => {
    const original = event.data.val();

    // My guess is you want to do something like this but maybe you do it client side. Not sure.
    // return functions.database.ref('/users').once('value').then(function(snapshot) {
    //     var users = snapshot.val();

    //     users.forEach((user) => {
    //         client.messages.create({ 
    //             to: "+1" + user["telephone"],
    //             from: "+12062025653",
    //             body: user["username"] + ", Join us for" + original["title"] + "!"  
    //         }, function(err, message) { 
    //             console.log(message.sid); 
    //         });
    //     });
    // });
});
