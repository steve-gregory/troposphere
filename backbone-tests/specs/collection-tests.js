define(function(require) {
  "use strict";

  var Backbone = require('backbone'),
      BaseStore = require('stores/BetterBaseStore');

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
      it("should fetch models from server if none exist", function () {
        var collection = new TestCollection();
        expect(collection.url).to.equal("/api/tests");
      });
    });

  });

});
