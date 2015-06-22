define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      Utils = require('./Utils'),
      ApplicationConstants = require('constants/ApplicationConstants');

  return {

    updateApplicationAttributes: function (application, newAttributes) {
      application.set(newAttributes);
      Utils.dispatch(ApplicationConstants.APPLICATION_UPDATE, {application: application});

      application.save({
        name: application.get('name'),
        description: application.get('description'),
        tags: application.get('tags')
      }, {
        patch: true
      }).done(function(){
        Utils.dispatch(ApplicationConstants.APPLICATION_UPDATE, {application: application});
      }).fail(function(response){
        Utils.displayError({title: "Your image could not be updated", response: response});
        Utils.dispatch(ApplicationConstants.APPLICATION_UPDATE, {application: application});
      });
    }

  };

});
