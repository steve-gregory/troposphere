define(function (require) {

  var BaseStore = require('stores/BetterBaseStore'),
      QuotaStatusCollection = require('collections/QuotaStatusCollection');

  var QuotaStatusStore = BaseStore.extend({
    collection: QuotaStatusCollection
  });

  var store = new QuotaStatusStore();

  return store;

});
