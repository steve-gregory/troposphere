define(function(require) {
  "use strict";

  var BaseStore = require('stores/BetterBaseStore'),
      TestStore = require('test/utils/TestStore'),
      serverRequests = require('test/utils/serverRequests'),
      server;

  describe("BaseStore#findWhere", function(){

    beforeEach(function(){
      server = sinon.fakeServer.create();
    });

    afterEach(function(){
      server.restore();
    });

    describe("when query does not exist", function () {
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
        var query = {
          name: "hello"
        };

        // query should not exist first time
        var results = store.findWhere(query);
        expect(results).to.not.exist;

        // get query from server
        server.respond();

        // query should now exist
        results = store.findWhere(query);
        expect(results.length).to.equal(1);
        expect(server.requests[0].url).to.equal(url);
      })
    });

    describe("when query does exist", function () {
      var url = "/api/tests?name=hello";

      // todo: add data to store using dispatcher

      it("should pass filter parameters to the server", function(){
        var store = new TestStore();
        var query = {
          name: "hello"
        };

        // query should now exist
        var results = store.findWhere(query);
        expect(results.length).to.equal(1);
        expect(server.requests[0].url).to.equal(url);
      })
    });

  });

});
