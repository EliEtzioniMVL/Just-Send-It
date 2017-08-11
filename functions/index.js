'use strict';

const functions = require('firebase-functions');
const twilio = require('twilio');
const config = require('./config.json');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

const MessagingResponse = twilio.twiml.MessagingResponse;
const projectId = process.env.GCLOUD_PROJECT;
const region = 'us-central1';

//require the Twilio module and create a REST client 
var client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

// repurpose this function to respond with adventure details
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

  // Conatiner for the event details outside of the return 
  // since there may be scope issues
  var description = '';
  var timestamp = '';
  var meetingpoint = '';

  // Grab the value of the most recent event (by timestamp) written to the events database
  // and add its details to the response message
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://just-send-it-3a10f.firebaseio.com/"
  })
  var db = admin.database().ref('/events');
//  console.log(db);

  db.orderByChild("timestamp").limitToLast(1).on("child_added", (snapshot) => {
      var all_info = snapshot.val();
      description = all_info.description;
      timestamp = all_info.timestamp;
      meetingpoint = all_info.meetingpoint;

      response.message('LETS GO. Stoked that you\'re coming out. Here\'s the plan: ' + description + '. See you at ' + meetingpoint + ' at ' + timestamp + ' sharp.');

      res
        .status(200)
        .type('text/xml')
        .end(response.toString());
  });
  // db.orderByChild("timestamp").limitToLast(1).on("child_added", function(snapshot) {
  //     var all_info = snapshot.val();
  //     description = all_info.description;
  //     timestamp = all_info.timestamp;
  //     meetingpoint = all_info.meetingpoint;
  // });

  // Add text to the response



  // Send the response
});

// Sends a welcome message when a user signs up and is added to users.
exports.welcomeMessage = functions.database.ref('/users/{userId}').onWrite((event) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = event.data.val();

    console.log("I made it to welcome message");

    client.messages.create({ 
        to: "+1" + original["telephone"],
        from: "+12062080284",
        body: original["username"] + ", thanks for joining Just Send It! If you ever want to unsubscribe just text this number with the message unsubscribe."  
    }, function(err, message) { 
        //console.log(message.sid); 
        console.log(err);
    });
});

// Sends an event message when a new event is added to events.
exports.eventMessage = functions.database.ref('/events/{eventId}').onWrite((event) => {
    const original = event.data.val();

    // My guess is you want to do something like this but maybe you do it client side. Not sure.
    return functions.database.ref('/users').once('value').then(function(snapshot) {
        var users = snapshot.val();

        users.forEach((user) => {
            client.messages.create({ 
                to: "+1" + user["telephone"],
                from: "+12062080284",
                body: "Hello, " + user["username"] + ", Want to join us for" + original["title"] + "in " + original["time"] + ". If you want to send it, just respond to this message saying whatever you'd like."  
            }, function(err, message) { 
                console.log(message.sid); 
            });
        });
    });
});
