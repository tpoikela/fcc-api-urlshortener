
var express = require("express");
var app = express();

var port = process.env.PORT || 8080;
var DEBUG = process.env.DEBUG || 0;

var db_url = process.env.DB_URL || "mongodb://localhost:27017/urlshortener";
var base_url = process.env.URL || "https://camper-api-project-tpoikela.c9users.io";

var Database = require("./src/database");
var Extractor = require("./src/extractor");

app.db = new Database(db_url);
app.extractor = new Extractor();

// Respond to / request with index.html
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// Here we must store the original address and return a shortened URL
app.get(/\/new\/(http|www)/, function(req, res){
    if (DEBUG) console.log("/new request with an URL");
    
    if (DEBUG) console.log("req.url: " + req.url);
    
    var orig_url = app.extractor.getUrl(req.url);
    
    if (orig_url !== null) {
        
        app.db.add(orig_url, (id) => {
            var short_url = base_url + "/" + id;
            var json = {original_url: orig_url, short_url: short_url};
            
            // And return the shortened version
            res.json(json);
        });
        
    }
    else {
        res.json({error: "URL not formatted properly. Must start with https(s)://"});
    }
});

app.get('/new/*', function(req, res) {
    res.json({error: "Ill-formatted URL. Cannot shorten."});
});

app.get("/form", function(req, res) {
    console.log("Catch all function triggered");
    res.sendStat(200);
});

// Here we must re-direct user to the original URL
app.get('/:id', function(req, res){
    
    var url = app.db.get(req.params.id, (url) => {
        // redirect user to url
        console.log("Redirectiong user to " + url);
        res.redirect(url);
    });
    
});



app.listen(port, function () {
    console.log('URL shortener microservice listening on port ' + port)
});

// For testing
module.exports = app;