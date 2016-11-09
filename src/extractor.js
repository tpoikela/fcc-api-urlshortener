
var url = require("url");
var validUrl = require('valid-url');

/** Module for extracting the requested URL from req body.*/
var Extractor = function() {
    
    this.getUrl = function(urlpath) {
        var url_parts = url.parse(urlpath);
        console.log("URL parts: " + JSON.stringify(url_parts));
        
        // The actual url comes after /new/
        var orig_url = url_parts.pathname;
        orig_url = orig_url.slice(5);
        console.log("Original URL now: " + orig_url);
        
        var validated = validUrl.isWebUri(orig_url);
        if (typeof validated === "undefined") {
            console.error("URL " + orig_url + " is not valid.");
            return null;
        }
        else {
            return validated;
        }
    };
    
};

module.exports = Extractor;