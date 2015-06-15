define(function(require) {
  "use strict";

  var Backbone = require('backbone'),
      BaseStore = require('stores/BetterBaseStore'),
      TestStore = require('test/utils/TestStore'),
      server;

  describe("BaseStore#find", function(){

    beforeEach(function(){
      server = sinon.fakeServer.create();
    });

    afterEach(function(){
      server.restore();
    });

    describe("with no arguments", function(){

      beforeEach(function(){
        server.respondWith(
          "GET",
          "/api/tests",
          [
            200, {
              "Content-Type": "application/json"
            },
            JSON.stringify({
                count: 2,
                next: null,
                previous: null,
                results: [
                  {"id": 1, "name": "hello"},
                  {"id": 2, "name": "world"}
                ]
              })
          ]);
      });

      it("should fetch models from server if none exist", function () {
        var store = new TestStore();
        var results = store.find();
        expect(results).to.be.undefined;
        server.respond();
        results = store.find();
        expect(results.length).to.equal(2);
        expect(server.requests[0].url).to.equal("/api/tests");
      });
    });

    describe("with arguments", function(){
      var url = "/api/tests?name=hello";

      beforeEach(function(){
        server.respondWith(
          "GET",
          url,
          [
            200, {
              "Content-Type": "application/json"
            },
            JSON.stringify({
                count: 2,
                next: null,
                previous: null,
                results: [
                  {"id": 1, "name": "hello"},
                  {"id": 2, "name": "world"}
                ]
              })
          ]);
      });

      it("should pass filter parameters to the server", function(){
        var store = new TestStore();
        var options = {
          where: {
            name: "hello"
          }
        };

        var results = store.find(options);
        expect(results).to.be.undefined;
        server.respond();
        results = store.find(options);
        expect(results.length).to.equal(2);
        expect(server.requests[0].url).to.equal(url);
      })
    });

  });

});
