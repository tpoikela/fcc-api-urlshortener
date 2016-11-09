
/** A file for testing the server response for URL shortener.*/

/** See also https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai */

process.env.NODE_ENV = 'test';

var chai = require("chai");
var expect = chai.expect;

var validUrl = require("valid-url");

var chaiHTTP = require("chai-http");
chai.use(chaiHTTP);

var request = require("request");
var server = require("../index");

describe("/", () => {
    it("Should get index.html from server", (done) => {
        chai.request(server).get("/")
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.be.html;
            //expect(res.software).to.equal(null);
            //expect(json.natural).to.equal(null);
            done();
        });
    });
});

var gmail_path =  "/new/http://www.gmail.com";

describe(gmail_path, () => {
    it("Should shorten given URL", (done) => {
        chai.request(server).get(gmail_path)
        .end( (err, res) => {
            expect(err).to.be.null;
            expect(res).to.be.json;
            
            var json = JSON.parse(res.text);
            
            expect(json).to.have.property("short_url");
            
            var short_url = validUrl.isWebUri(json.short_url);
            
            expect(typeof short_url).not.to.equal("undefined");
            
            expect(json.original_url).to.equal("http://www.gmail.com");
            
            done();
            
        }); 
    });
});

describe("Error response", () => {
    it("Should return error for invalid URL", (done) => {
        chai.request(server).get("/new/xxx.kkk.yyy")
        .end( (err, res) => {
            expect(err).to.be.null;
            expect(res).to.be.json;
            
            var json = JSON.parse(res.text);
            expect(json).to.have.property("error");
            done();
        });
    });
});


describe("Full use case with URL redirection", () => {
    var firstReq;
    var short_url = "";
    
    before( (done) => {
        chai.request(server).get("/new/https://www.google.com")
        .end( (err, res) => {
            expect(err).to.be.null;
            expect(res).to.be.json;
            
            var text = res.text;
            var json = JSON.parse(text);
            
            expect(json).to.have.property("short_url");
            expect(json).to.have.property("original_url");
            
            short_url = json.short_url;
            console.log("short_url is: " + short_url);
            done();
        });
    });
    
    it("Should redirect to original URL", (done) => {
        request.get(short_url, (err, res, body) => {
            expect(err).to.be.null;
            expect(res).to.be.html;
            
            done();
        });
        
    });
    
})