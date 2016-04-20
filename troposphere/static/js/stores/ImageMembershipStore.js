define(function (require) {

  var Dispatcher = require('dispatchers/Dispatcher'),
      BaseStore = require('stores/BaseStore'),
      ImageMembershipCollection = require('collections/ImageMembershipCollection'),
      ImageMembershipConstants = require('constants/ImageMembershipConstants'),
      MembershipCollection = require('collections/MembershipCollection'),
      Membership = require('models/Membership');

  var _modelsFor = {};
  var _isFetchingFor = {};

  var ImageMembershipStore = BaseStore.extend({
    collection: ImageMembershipCollection,

    initialize: function(){
      this.models = new ImageMembershipCollection();
    },

    fetchModelsFor: function(imageId){
      if(!_modelsFor[imageId] && !_isFetchingFor[imageId]) {
        _isFetchingFor[imageId] = true;
        var models = new ImageMembershipCollection();
        models.fetch({
          url: models.url + "?image_id=" + imageId
        }).done(function () {
          _isFetchingFor[imageId] = false;

          // add models to existing cache
          this.models.add(models.models);

          // convert ImageMembership collection to a MembershipCollection
          var memberships = models.map(function(image_membership){
            return new Membership(image_membership.get('membership'), {parse: true});
          });
          memberships = new MembershipCollection(memberships);

          _modelsFor[imageId] = memberships;
          this.emitChange();
        }.bind(this));
      }
    },

    getMembershipsFor: function(image){
      if(!_modelsFor[image.id]) return this.fetchModelsFor(image.id);

      // convert ImageMembership collection to an MembershipCollection
      var imageMemberships = this.models.filter(function(image_membership){
        return image_membership.get('image').id === image.id;
      });

      var memberships = imageMemberships.map(function(image_membership){
        return new Membership(image_membership.get('membership'), {parse: true});
      });
      return new MembershipCollection(memberships);
    }

  });

  var store = new ImageMembershipStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case ImageMembershipConstants.ADD_IMAGE_MEMBERSHIP:
        store.add(payload.image_membership);
        break;

      case ImageMembershipConstants.REMOVE_IMAGE_MEMBERSHIP:
        store.remove(payload.image_membership);
        break;

      case ImageMembershipConstants.EMIT_CHANGE:
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
