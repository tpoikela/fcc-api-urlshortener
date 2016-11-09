
var express = require("express");
var app = express();

var port = process.env.PORT || 8080;

var db_url = "";
var base_url = process.env.URL || "https://camper-api-project-tpoikela.c9users.io";

var Database = require("./src/database");
var Extractor = require("./src/extractor");

var db = new Database(db_url);
var extractor = new Extractor();

// Respond to / request with index.html
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// Here we must store the original address and return a shortened URL
app.get(/\/new\/(http|www)/, function(req, res){
    console.log("/new request with an URL");
    
    console.log("req.url: " + req.url);
    
    var orig_url = extractor.getUrl(req.url);
    var short_url = base_url + "/" + db.nextID;
    db.add(orig_url);
    
    var json = {original_url: orig_url, short_url: short_url};
    // Extract the URL
    
    // Validate the URL
    
    // Shorten the URL
    
    // And return the shortened version
    res.json(json);
});

// Here we must re-direct user to the original URL
app.get('/:id', function(req, res){
    
    // var url = db.get(:id);
    // redirect user to url
    
});

app.listen(port, function () {
    console.log('URL shortener microservice listening on port ' + port)
});

// For testing
module.exports = app;