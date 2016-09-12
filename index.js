var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

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