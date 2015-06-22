define(function(require) {
  "use strict";

  var BaseStore = require('stores/BetterBaseStore'),
      TestStore = require('test/utils/TestStore'),
      serverRequests = require('test/utils/serverRequests'),
      server;

  describe("BaseStore#findMore", function(){

    beforeEach(function(){
      server = sinon.fakeServer.create();
    });

    afterEach(function(){
      server.restore();
    });

    describe("when no results no exist", function () {

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
              next: "/api/tests?page=2",
              previous: null,
              results: [
                {"id": 1, "name": "hello"}
              ]
            })
          ]);

        server.respondWith(
          "GET",
          "/api/tests?page=2",
          [
            200, {
              "Content-Type": "application/json"
            },
            JSON.stringify({
              count: 2,
              next: null,
              previous: "/api/tests",
              results: [
                {"id": 2, "name": "world"}
              ]
            })
          ]);
      });

      it("should fetch the first, then second page of data", function () {
        var store = new TestStore();

        // first fetch, should not exist
        var results = store.find();
        expect(results).to.be.undefined;

        // get the result from the server
        server.respond();

        // try again - model should exist this time
        results = store.find();
        expect(results.length).to.equal(1);

        // fetch the next page - should return what it current has
        results = store.findMore();
        expect(results.length).to.equal(1);

        // get the next page from the server
        server.respond();

        // try again - model should exist this time
        results = store.find();
        expect(results.length).to.equal(2);

        expect(server.requests[0].url).to.equal("/api/tests");
        expect(server.requests[1].url).to.equal("/api/tests?page=2");
      });
    });

  });

});
