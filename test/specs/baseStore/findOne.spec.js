define(function(require) {
  "use strict";

  var BaseStore = require('stores/BetterBaseStore'),
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
      var modelId = 1,
          store;

      describe("and default data has already been fetched", function(){

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

          server.respondWith(
            "GET",
            "/api/tests/2",
            [
              200, {
                "Content-Type": "application/json"
              },
              JSON.stringify({
                "id": 2, "name": "world"
              })
            ]);

          store = new TestStore();
          store.find();
          server.respond();
        });

        it("should return the model with that id", function(){
          var model = store.findOne(2);
          server.respond();
          model = store.findOne(2);
          expect(model.id).to.equal(2);

          // this should not cause a second call to the server
          expect(server.requests.length).to.equal(1);
          expect(server.requests[0].url).to.equal("/api/tests");
        });

      });

      describe("and no data has been fetched", function(){

        beforeEach(function(){
          server.respondWith(
            "GET",
            "/api/tests/2",
            [
              200, {
                "Content-Type": "application/json"
              },
              JSON.stringify({
                "id": 2, "name": "world"
              })
            ]);

          store = new TestStore();
        });

        it("should return the model with that id", function(){
          var model = store.findOne(2);
          expect(model).to.be.undefined;
          server.respond();
          model = store.findOne(2);
          expect(model.id).to.equal(2);

          // this should not cause a second call to the server
          expect(server.requests.length).to.equal(1);
          expect(server.requests[0].url).to.equal("/api/tests/2");
        });
      })

    });
  })

});
