
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

describe("/new/www.gmail.com", () => {
    it("Should shorten given URL", (done) => {
        chai.request(server).get("/new/www.gmail.com")
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.be.json;
        }); 
        done();
    });
});