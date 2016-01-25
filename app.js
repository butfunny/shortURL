var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var URL = require('./dao/short-url-dao');
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

app.post("/check/url", function (req ,res) {
    URL.findOne({realURL: req.body.url}, function (err, url) {
        if (url != null) {
            res.json(url);
        } else {
            rp(req.body.url)
                .then(function () {
                    res.json({new: true});
                })
                .catch(function (err)    {
                    res.json({error: true});
                });
        }
    })

});

app.post("/create/random", function (req ,res) {
    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    var rString = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    URL.create({realURL: req.body.url, shortURL: rString}, function (err, newURL) {
        res.json(newURL);
    })
});

app.get("/:url", function (req, res) {
    URL.findOne({shortURL: req.params.url}, function (err, url) {
        if (url != null) {
            res.writeHeader(200, {"Content-Type": "text/html"});
            res.write('<html>'+
            '<head>'+
            '<title>Redirecting..</title>'+
            '<META http-equiv="refresh" content="3;URL='+url.realURL+'">'+
            '</head>'+
            '<body>'+
            'The contents you are looking for have moved. You will be redirected to the new location automatically in 3 seconds. Please bookmark the correct page at <a href="'+url.realURL+'"> here</a>'+
            '</body>'+
            '</html>');
            res.end();
        } else {
            res.writeHeader(200, {"Content-Type": "text/html"});
            res.write('<html>'+
                '<head>'+
                '<title>Error 404 Not Found</title>'+
                '</head>'+
                '<body>'+
                'Click <a href="http://localhost:3000">here</a> to go back'+
                '</body>'+
                '</html>');
            res.end();
        }
    })

});

app.post("/create/customize", function (req , res) {
    URL.findOne({shortURL: req.body.url}, function (err, url) {
        if (url == null) {
            URL.create({shortURL: req.body.url, realURL: req.body.realURL}, function (err, url) {
                res.send(url);
            })
        } else {
            res.send({error: true});
        }
    })
})

var port = 3000;

http.listen(port, function () {
    console.log("Server running in port: " + port);
});