
const url = require("url");
const express = require("express");
const querystring = require('querystring');

var app = express();

var port = process.env.PORT || 8080;
var DEBUG = process.env.DEBUG || 0;

//var db_url = process.env.MONGOLAB_URI || "mongodb://localhost:27017/urlshortener";
var db_url = "mongodb://localhost:27017/urlshortener";

const Database = require("./src/database");
const Extractor = require("./src/extractor");

app.db = new Database(db_url);
app.extractor = new Extractor();

// Respond to / request with index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Here we must store the original address and return a shortened URL
app.get(/\/new\/(http|www)/, (req, res) => {
    if (DEBUG) console.log("app.get /new req.url: " + req.url);
    
    var orig_url = app.extractor.getUrl(req.url);
    var base_url = getBaseUrl(req);
    
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

app.get('/new/*', (req, res) => {
    res.json({error: "Ill-formatted URL. Must start with proto http|https."});
});

// Process the form input here, respond also in JSON
app.get("/form", (req, res) => {
    if (DEBUG) console.log("ROUTE: app.get /form")
    if (DEBUG) console.log("get /form triggered: " + JSON.stringify(req.url));
    var urlObj = url.parse(req.url);
    if (DEBUG) console.log("url.query: " + JSON.stringify(urlObj.query));
    
    var query = querystring.parse(urlObj.query);
    if (DEBUG) console.log("parsed query: " + JSON.stringify(query));
    
    var orig_url = query.orig_url;
    orig_url = "/new/" + orig_url; // Extractor expects this
    orig_url = app.extractor.getUrl(orig_url);
    
    var base_url = getBaseUrl(req);
    
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

// Here we must re-direct user to the original URL
app.get('/:id', (req, res) => {
    if (DEBUG) console.log("ROUTE: app.get /:id")
    
    var url = app.db.get(req.params.id, (url) => {
        // redirect user to url
        console.log("Redirecting a user to " + url);
        res.redirect(url);
    });
    
});

/* Returns the base URL of this server.*/
function getBaseUrl(req) {
    var proto = req.headers['x-forwarded-proto'];
    return proto + "://" + req.headers.host;
};


app.listen(port, () => {
    console.log('URL shortener microservice listening on port ' + port)
});

// For testing
module.exports = app;