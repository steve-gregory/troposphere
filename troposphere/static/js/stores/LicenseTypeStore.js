define(function (require) {

  var BaseStore = require('stores/BaseStore'),
      LicenseTypeCollection = require('collections/LicenseTypeCollection');

  var LicenseTypeStore = BaseStore.extend({
    collection: LicenseTypeCollection
  });

  var store = new LicenseTypeStore();

  return store;

});
