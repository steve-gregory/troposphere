define(function(require) {
  "use strict";

  var Backbone = require('backbone'),
      BaseStore = require('stores/BetterBaseStore'),
      TestStore = require('test/utils/TestStore'),
      server;

  describe("BaseStore#findOne", function(){

    beforeEach(function(){
      server = sinon.fakeServer.create();
    });

    afterEach(function(){
      server.restore();
    });

    describe("when passed an id", function(){
      var modelId = 1;

      describe("when model is NOT in local cache", function(){

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

        it("should return the model with that id", function(){
          var store = new TestStore();
          var result = store.findOne(modelId);
          expect(result).to.be.undefined;
          server.respond();
          result = store.findOne(modelId);
          expect(result.id).to.equal(modelId);
          expect(server.requests[0].url).to.equal("/api/tests/1");
        });
      });

      describe("when model is in local cache", function(){

        beforeEach(function(){
          server.respondWith(
            "GET",
            "/api/tests",
            [
              200, {
                "Content-Type": "application/json"
              },
              JSON.stringify([
                { "id": 1, "comment": "Hey there" }
              ])
            ]);
        });

        it("should return the model with that id", function(){
          var store = new TestStore();
          var result = store.find();
          expect(result).to.be.undefined;
          server.respond();
          result = store.findOne(modelId);
          expect(result.id).to.equal(modelId);
        });
      })

    });

    describe("when passed an object", function(){
      var modelId = 1,
          url = "/api/tests?name=hello",
          options = {
            where: {
              name: "hello"
            }
          };

      describe("when model is NOT in local cache", function(){

        beforeEach(function(){
          server.respondWith(
            "GET",
            url,
            [
              200, {
                "Content-Type": "application/json"
              },
              JSON.stringify([
                {
                  "id": 1, name: "goodbye"
                },
                {
                  "id": 2, name: "hello"
                }
              ])
            ]
          );

          server.respondWith(
            "GET",
            "/api/tests",
            [
              200, {
                "Content-Type": "application/json"
              },
              JSON.stringify([
                {
                  "id": 1, name: "goodbye"
                },
                {
                  "id": 2, name: "hello"
                }
              ])
            ]
          );
        });

        it("should pass the query to the server", function(){
          var store = new TestStore();

          var result = store.findOne(options);
          expect(result).to.be.undefined;
          server.respond();
          var request = server.requests[0];
          expect(request.url).to.equal(url);
        });

        it("should return a single model", function(){
          var store = new TestStore();

          var result = store.findOne(options);
          expect(result).to.be.undefined;
          server.respond();
          result = store.findOne(options);
          expect(result.id).to.equal(2);
        });

        it("should return the correct model", function(){
          var store = new TestStore();

          var result = store.findOne(options);
          expect(result).to.be.undefined;
          server.respond();
          result = store.findOne(options);
          expect(result.id).to.equal(2);
        });

        it("should only make one call to the server", function(){
          var store = new TestStore();

          var result = store.findOne(options);
          server.respond();
          result = store.findOne(options);
          expect(server.requests.length).to.equal(1);
        });

      });

      describe("when model IS in local cache", function(){

        beforeEach(function(){
          server.respondWith(
            "GET",
            url,
            [
              200, {
                "Content-Type": "application/json"
              },
              JSON.stringify([
                {
                  "id": 1, name: "goodbye"
                },
                {
                  "id": 2, name: "hello"
                }
              ])
            ]
          );

          server.respondWith(
            "GET",
            "/api/tests",
            [
              200, {
                "Content-Type": "application/json"
              },
              JSON.stringify([
                {
                  "id": 1, name: "goodbye"
                },
                {
                  "id": 2, name: "hello"
                }
              ])
            ]
          );
        });

        it("should not make a server request if all models already in cache", function(){
          var store = new TestStore();
          store.find();
          server.respond();
          var result = store.findOne(options);
          expect(server.requests.length).to.equal(1);
        });

        it("should do stuff", function(){

        })

      })

    });

    it("should return a single item");
    it("should fetch models if none exist");
    it("should return model from local cache if all models fetched");
    it("should make server request if not all models cached");
  })

});
