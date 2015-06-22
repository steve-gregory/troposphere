define(function(require) {
  "use strict";

  var BaseStore = require('stores/BetterBaseStore'),
      TestStore = require('test/utils/TestStore'),
      serverRequests = require('test/utils/serverRequests'),
      server;

  describe("BaseStore#findOne", function(){

    beforeEach(function(){
      server = sinon.fakeServer.create();
    });

    afterEach(function(){
      server.restore();
    });

    describe("when passed an id", function() {
      var modelId = 1,
          store;

      beforeEach(function(){
        store = new TestStore();
      });

      describe("and model has not been fetched", function () {
        it("should fetch the model and return it during the next call", function () {
          // first fetch, should not exist
          var model = store.findOne(modelId);
          expect(model).to.not.exist;

          // fetch model from server
          server.respond();

          // try again - model should exist this time
          model = store.findOne(modelId);
          expect(model).to.exist;
          expect(model.id).to.equal(modelId);
        })
      });

      describe("and model has already been fetched", function () {

        // todo: add the model to the store using dispatcher

        it("should return the model", function () {
          // first fetch, should not exist
          var model = store.findOne(modelId);
          expect(model).to.exist;
          expect(model.id).to.equal(modelId);
        })
      })
    });

    //describe("when passed an id2", function(){
    //  describe("and default data has already been fetched", function(){
    //
    //    beforeEach(function(){
    //      //server.respondWith(
    //      //  "GET",
    //      //  "/api/tests",
    //      //  [
    //      //    200, {
    //      //      "Content-Type": "application/json"
    //      //    },
    //      //    JSON.stringify({
    //      //      count: 2,
    //      //      next: null,
    //      //      previous: null,
    //      //      results: [
    //      //        {"id": 1, "name": "hello"},
    //      //        {"id": 2, "name": "world"}
    //      //      ]
    //      //    })
    //      //  ]);
    //
    //      serverRequests(server, "completeData");
    //      serverRequests(server, "singleModel");
    //
    //      //server.respondWith(
    //      //  "GET",
    //      //  "/api/tests/2",
    //      //  [
    //      //    200, {
    //      //      "Content-Type": "application/json"
    //      //    },
    //      //    JSON.stringify({
    //      //      "id": 2, "name": "world"
    //      //    })
    //      //  ]);
    //
    //      var store = new TestStore();
    //      store.find();
    //      server.respond();
    //    });
    //
    //    it("should return the model with that id", function(){
    //      var model = store.findOne(2);
    //      server.respond();
    //      model = store.findOne(2);
    //      expect(model.id).to.equal(2);
    //
    //      // this should not cause a second call to the server
    //      expect(server.requests.length).to.equal(1);
    //      expect(server.requests[0].url).to.equal("/api/tests");
    //    });
    //
    //  });
    //
    //  describe("and no data has been fetched", function(){
    //
    //    beforeEach(function(){
    //      server.respondWith(
    //        "GET",
    //        "/api/tests/2",
    //        [
    //          200, {
    //            "Content-Type": "application/json"
    //          },
    //          JSON.stringify({
    //            "id": 2, "name": "world"
    //          })
    //        ]);
    //
    //      var store = new TestStore();
    //    });
    //
    //    it("should return the model with that id", function(){
    //      var model = store.findOne(2);
    //      expect(model).to.be.undefined;
    //      server.respond();
    //      model = store.findOne(2);
    //      expect(model.id).to.equal(2);
    //
    //      // this should not cause a second call to the server
    //      expect(server.requests.length).to.equal(1);
    //      expect(server.requests[0].url).to.equal("/api/tests/2");
    //    });
    //  })
    //
    //});
  })

});
