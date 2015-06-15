define(function(require) {
  "use strict";

  var Backbone = require('backbone'),
      BaseStore = require('stores/BetterBaseStore'),
      server;

  beforeEach(function(){
    server = sinon.fakeServer.create();
  });

  afterEach(function(){
    server.restore();
  });

  describe("BaseStore", function () {
    var TestModel, TestCollection, TestStore;

    beforeEach(function(){
      TestModel = Backbone.Model.extend({
        urlRoot: "/api/tests"
      });

      TestCollection = Backbone.Collection.extend({
        model: TestModel,
        url: "/api/tests"
      });

      TestStore = BaseStore.extend({
        collection: TestCollection
      });
    });

    describe("#find", function(){

      describe("with no arguments", function(){

        beforeEach(function(){
          server.respondWith(
            "GET",
            "/api/tests",
            [
              200, {
                "Content-Type": "application/json"
              },
              JSON.stringify([
                { "id": 12, "comment": "Hey there" }
              ])
            ]);
        });

        it("should fetch models from server if none exist", function () {
          //var collection = new TestCollection();
          //expect(collection.url).to.equal("/api/tests");
          //collection.fetch().done(function(){
          //  expect(collection.length).to.equal(1);
          //  done();
          //});

          var store = new TestStore();
          var results = store.find();
          expect(results).to.be.undefined;
          server.respond();
          results = store.find();
          expect(results.length).to.equal(1);
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
              JSON.stringify([
                { "id": 12, "comment": "Hey there" }
              ])
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
          expect(results.length).to.equal(1);
          expect(server.requests[0].url).to.equal(url);
        })
      })

    });

    describe("#findOne", function(){
      describe("when passed an id", function(){
        var modelId = 1;

        beforeEach(function(){
          server.respondWith(
            "GET",
            "/api/tests/1",
            [
              200, {
                "Content-Type": "application/json"
              },
              JSON.stringify({
                "id": 1, "comment": "Hey there"
              })
            ]);
        });

        it.only("should return the model with that id", function(){
          var store = new TestStore();
          var result = store.findOne(modelId);
          expect(result).to.be.undefined;
          server.respond();
          result = store.findOne(modelId);
          expect(result.id).to.equal(modelId);
          expect(server.requests[0].url).to.equal("/api/tests/1");
        });
      });

      it("should return a single item");
      it("should fetch models if none exist");
      it("should return model from local cache if all models fetched");
      it("should make server request if not all models cached");
    })

  });

});
