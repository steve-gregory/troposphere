define(function (require) {

  var BaseStore = require('stores/BetterBaseStore'),
      ProviderCollection = require('collections/ProviderCollection');

  var ProviderStore = BaseStore.extend({
    collection: ProviderCollection
  });

  var store = new ProviderStore();

  return store;

});
