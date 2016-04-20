define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      ImageMembershipConstants = require('constants/ImageMembershipConstants'),
      ImageMembership = require('models/ImageMembership'),
      Utils = require('./Utils'),
      stores = require('stores');

  return {

    add: function(params){
      if(!params.image) throw new Error("Missing image");
      if(!params.membership) throw new Error("Missing membership");

      var image = params.image,
          membership = params.membership,
          imageMembership = new ImageMembership(),
          data = {
            image: image.id,
            membership: membership.id
          };

      imageMembership.save(null, {
        attrs: data
      }).done(function(){
        Utils.dispatch(ImageMembershipConstants.ADD_IMAGE_MEMBERSHIP, {imageMembership: imageMembership});
      }).fail(function(response){
        Utils.displayError({title: "Membership could not be added to Image", response: response});
      });
    },

    remove: function(params){
      if(!params.image) throw new Error("Missing image");
      if(!params.group) throw new Error("Missing group");

      var image = params.image,
          membership = params.group,
          imageMembership = stores.ImageMembershipStore.findOne({
            'image.id': image.id,
            'group.id': membership.id
          });

      imageMembership.destroy().done(function(){
        Utils.dispatch(ImageMembershipConstants.REMOVE_IMAGE_MEMBERSHIP, {imageMembership: imageMembership});
      }).fail(function(response){
        Utils.displayError({title: "Membership could not be removed from Image", response: response});
      });
    }

  };

});
