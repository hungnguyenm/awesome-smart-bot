var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var cleverbot = require("cleverbot.io");
var app = express();
var bot = new cleverbot("JGjG1bPciITXCB0X", "HYhY8A7oB3u5yGG427XCgIAJtToqJ2jV");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 4513));

// Server frontpage
app.get('/', function (req, res) {
    res.send('AMA Bot is running...');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'this_is_my_nekot') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
        	bot.ask(event.message.text, function (err, response) {
			  sendMessage(event.sender.id, {text: response});
			  console.log('ID: ', event.sender.id);
			  console.log('Text: ', event.message.text);
			  console.log('Resp: ', response);
			});
        }
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.7/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};