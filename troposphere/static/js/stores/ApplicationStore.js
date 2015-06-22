define(function (require) {

  var ApplicationCollection = require('collections/ApplicationCollection'),
      Dispatcher = require('dispatchers/Dispatcher'),
      BaseStore = require('stores/BetterBaseStore'),
      ApplicationConstants = require('constants/ApplicationConstants'),
      NotificationController = require('controllers/NotificationController');

  var ApplicationStore = BaseStore.extend({
    collection: ApplicationCollection,

    queryParamMap: {
      "tags__name": "tags__name",
      "search": "search",
      "created_by__username": "created_by__username"
    }
  });

  var store = new ApplicationStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
      case ApplicationConstants.APPLICATION_UPDATE:
        store.update(payload.application);
        break;

      default:
        return true;
    }

    store.emitChange();

    return true;
  });

  return store;
});
