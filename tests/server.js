
/** A file for testing the server response for URL shortener.*/

/** See also https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai */

process.env.NODE_ENV = 'test';

var chai = require("chai");
var expect = chai.expect;

var chaiHTTP = require("chai-http");
chai.use(chaiHTTP);

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
        });
    });
});