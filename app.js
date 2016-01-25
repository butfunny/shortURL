var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shortURL');

var http = require('http').Server(app);
var rp = require('request-promise');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
    res.set("Access-Control-Allow-Origin" , "*");
    res.set("Access-Control-Allow-Credentials", "true");
    res.set("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, set-cookie, Authorization");
    res.set("Access-Control-Expose-Headers", "Set-Cookie");
    next();
});


app.use(express.static(__dirname + "/public"));

app.post("/check-url", function (req ,res) {
    rp(req.body.url)
        .then(function (htmlString) {
            // Process html... 
        })
        .catch(function (err) {
            // Crawling failed...
        });
});

var port = 3000;

http.listen(port, function () {
    console.log("Server running in port: " + port);
});