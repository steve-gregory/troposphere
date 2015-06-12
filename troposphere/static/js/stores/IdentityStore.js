define(function(require) {

  var BaseStore = require('stores/BetterBaseStore'),
      IdentityCollection = require('collections/IdentityCollection');

  var IdentityStore = BaseStore.extend({
    collection: IdentityCollection
  });

  var store = new IdentityStore();

  return store;

});
