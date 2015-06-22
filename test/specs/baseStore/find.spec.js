define(function(require) {
  "use strict";

  var BaseStore = require('stores/BetterBaseStore'),
      TestStore = require('test/utils/TestStore'),
      serverRequests = require('test/utils/serverRequests'),
      server;

  describe("BaseStore#find", function(){
    var url = "/api/tests";

    beforeEach(function(){
      server = sinon.fakeServer.create();

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

    afterEach(function(){
      server.restore();
    });

    describe("when result does not exist", function () {
      it("should fetch the result and return it during the next call", function () {
        var store = new TestStore();

        // first fetch, should not exist
        var results = store.find();
        expect(results).to.be.undefined;

        // get the result from the server
        server.respond();

        // try again - model should exist this time
        results = store.find();
        expect(results.length).to.equal(2);
        expect(server.requests[0].url).to.equal(url);
      });
    });

    describe("when result exists", function () {
      var store;

      // todo: add the model to the store using dispatcher
      beforeEach(function(){
        store = new TestStore();
        store.find();
        server.respond();
      });

      it("should return the result", function () {
        // first fetch, should exist
        var results = store.find();
        expect(results.length).to.equal(2);
        expect(server.requests[0].url).to.equal(url);
      });
    });

  });

});
