define(function (require) {

  var Dispatcher = require('dispatchers/Dispatcher'),
      BaseStore = require('stores/BetterBaseStore'),
      ImageBookmarkCollection = require('collections/ImageBookmarkCollection'),
      ImageBookmarkConstants = require('constants/ImageBookmarkConstants'),
      ImageCollection = require('collections/ApplicationCollection'),
      stores = require('stores');

  function findOneIn(params, models){
      var keys = Object.keys(params);

      var model = models.find(function(model){
        var matchesCriteria = true;

        keys.forEach(function(key){
          if(!matchesCriteria) return;

          var tokens = key.split('.');
          if(tokens.length === 1){
            if(model.get(key) !== params[key]) matchesCriteria = false;
          }else{
            if(model.get(tokens[0])[tokens[1]] !== params[key]) matchesCriteria = false;
          }
        });

        return matchesCriteria;
      });

      return model;
    }

  var ImageBookmarkStore = BaseStore.extend({
    collection: ImageBookmarkCollection,

    getBookmarkedImages: function(){
      var models = this.modelsByQuery["empty"];
      if(!models) return this.find();

      var haveAllImages = true;

      var images = models.map(function(ib){
        // this will cause the image to be fetched if we don't yet have it
        var image = stores.ApplicationStore.findOne(ib.get('image').id);
        if(!image) haveAllImages = false;
        return image;
      });

      if(!haveAllImages) return null;

      return new ImageCollection(images);
    },

    findOneWhere: function(query){
      // todo: replace this hack implemention with a real one that works for all stores
      if(Object.keys(query).length !== 1 || !query['image.id']) {
        throw new Error(
          "ImageBookmarkStore.findOneWhere is a hack and only works for " +
          "{'image.id': image.id}. Recieved: " + JSON.stringify(query)
        )
      }

      var models = this.modelsByQuery["empty"];
      if(!models) return this.find();

      return findOneIn(query, models);
    }

  });

  var store = new ImageBookmarkStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case ImageBookmarkConstants.ADD_IMAGE_BOOKMARK:
        store.add(payload.imageBookmark);
        break;

      case ImageBookmarkConstants.REMOVE_IMAGE_BOOKMARK:
        store.remove(payload.imageBookmark);
        break;

      case ImageBookmarkConstants.EMIT_CHANGE:
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
