
var express = require("express");
var app = express();

var port = process.env.PORT || 8080;

var database = require("./src/database")

// Respond to / request with index.html
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// Here we must store the original address and return a shortened URL
app.get(/\/new\/(http|www)/, function(req, res){
});

// Here we must re-direct user to the original URL
app.get('/new/:id', function(req, res){
});

app.listen(port, function () {
    console.log('URL shortener microservice listening on port ' + port)
});

module.exports = app;