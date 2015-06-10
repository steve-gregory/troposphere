define(function (require) {

  var BaseStore = require('stores/BaseStore'),
      LicenseCollection = require('collections/LicenseCollection'),
      LicenseConstants = require('constants/LicenseConstants');

  var LicenseStore = BaseStore.extend({
    collection: LicenseCollection
  });

  var store = new LicenseStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || {};

    switch (actionType) {
      case LicenseConstants.ADD_LICENSE:
        store.add(payload.license);
        break;

      case LicenseConstants.UPDATE_LICENSE:
        store.update(payload.license);
        break;

      case LicenseConstants.REMOVE_LICENSE:
        store.remove(payload.license);
        break;

       default:
         return true;
    }

    if(!options.silent) {
      store.emitChange();
    }

    return true;
  });

  return store;

});
