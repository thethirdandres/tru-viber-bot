'use strict';

const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;

const Store = require('./infrastructure/repositories/storeData');
const Receiver = require('./infrastructure/controllers/receiver');
const Responder = require('./infrastructure/controllers/responder');

const express = require('express');
const app = express(); // creates http server
const { urlencoded } = require("body-parser");
const Factory = require('./infrastructure/helpers/factory');
const Helper = require('./infrastructure/helpers/helper');
app.use(
    urlencoded({
      extended: true
    })
  );

require('dotenv').config();

const bot = new ViberBot({
    authToken: process.env.VIBER_AUTHTOKEN,
    name: "Toys\"R\"Us PH",
     avatar: `https://storage.googleapis.com/avigate-rds-tru-prod-bucket/TRU/tru-bot-resources/TRU%20Logo.jpg`
})

// app should terminate if ff env variables are missing
if (!process.env.VIBER_AUTHTOKEN) {
    console.log("Could not find bot account token key.");
    return;
}
if (!process.env.VIBER_EXPOSE_URL) {
    console.log("Could not find exposing url");
    return;
}

// triggered when user opens the for the first time via invite link or searching
bot.onConversationStarted( async (userProfile, isSubscribed, context, onFinish) => {
    onFinish(await Responder.genGetStartedButtonElements(userProfile));

});

// all messages sent to the bot are received here
bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
    let delay = 0;
    console.log(response.userProfile);
    console.log(message);

    if(message.text && message.text.split("POSTBACK|")[1] == "GET STARTED") {
        console.log("someone pressed Get started");
        await Store.setUserDetails(response.userProfile, message);
    } else if(message.text) {
        console.log("someone did not press Get started and is not a postback");
        await Store.setUserDetails(response.userProfile, message);
    }
    
    let res = await Receiver.handleMessage(response.userProfile, message);
    
    try {
        console.log('Response: ', res); 

        res.forEach(async (element) => {
            sendMessage(element, response, delay*1500);
            delay++;
        });
    } catch (error) {
        console.log('Error sending response to user:\n\n', error);
    }
    
});

function sendMessage(responseMsg, response, delay) {
    setTimeout(() => response.send(responseMsg), delay);
}

const port = process.env.PORT || 3000;
app.use(`/viber/webhook/`, bot.middleware());

if(process.env.VIBER_EXPOSE_URL) {
    app.listen(port, () => {
        console.log(`Application running on port: ${port}`);
        bot.setWebhook(`${process.env.VIBER_EXPOSE_URL}/viber/webhook`)
            .catch(error => {
                console.error('Error setting webhook', error);
                process.exit(1);
            });
    });
}

app.get("/webhook", (req, res) => {
    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
  
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
      // Checks the mode and token sent is correct
      if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
        // Responds with the challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
});