define(function(require) {
  "use strict";

  var BaseStore = require('stores/BetterBaseStore'),
      TestCollection = require('test/utils/TestCollection'),
      TestStore = require('test/utils/TestStore'),
      serverRequests = require('test/utils/serverRequests'),
      server;

  describe("BaseStore#findWhere", function(){
    var url = "/api/tests?name=hello";

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
            count: 1,
            next: null,
            previous: null,
            results: [
              {"id": 1, "name": "hello"}
            ]
          })
        ]);
    });

    afterEach(function(){
      server.restore();
    });

    describe("when queryParamMap defined", function(){
      var TestStore;

      beforeEach(function(){
        TestStore = BaseStore.extend({
          collection: TestCollection,
          queryParamMap: {
            "name": "title"
          }
        });
      });

      it("should convert local query to server query", function(){
        var store = new TestStore();
        var results = store.findWhere({
          name: "hello"
        });
        expect(server.requests[0].url).to.equal("/api/tests?title=hello");
      });

    });

    describe("when queryParamMap is not defined", function(){
      var TestStore;

      beforeEach(function(){
        TestStore = BaseStore.extend({
          collection: TestCollection
        });
      });

      it("should throw an error when making a server call from query", function(){
        var store = new TestStore();

        var fn = function(){
          store.findWhere({
            name: "hello"
          });
        };

        expect(fn).to.throw(Error, "must define a queryParamMap in order to make server side filtering calls");
      });
    });

    describe("when query does not exist", function () {

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
      var query = {
            name: "hello"
          },
          store;

      beforeEach(function(){
        store = new TestStore();
        store.findWhere(query);
        server.respond();
      });

      it("should pass filter parameters to the server", function(){
        // query should now exist
        var results = store.findWhere(query);
        expect(results.length).to.equal(1);
        expect(server.requests[0].url).to.equal(url);
      })
    });

  });

});
