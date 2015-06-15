define(function(require) {
  "use strict";

  var Backbone = require('backbone'),
      BaseStore = require('stores/BetterBaseStore'),
      server;

  before(function(){
    server = sinon.fakeServer.create();
  });

  after(function(){
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

      it("should fetch models from server if none exist", function (done) {
        var collection = new TestCollection();
        collection.fetch().done(function(){
          console.log(collection.toJSON());
          done();
        });
        server.respond();
        expect(collection.url).to.equal("/api/tests");
      });
    });

  });

});
