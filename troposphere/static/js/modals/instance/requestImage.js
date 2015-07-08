define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceImageWizardModal = require('components/modals/instance/InstanceImageWizardModal.react'),
      actions = require('actions');

  return {

    requestImage: function(params){
      if(!params.instance) throw new Error("Missing instance");

      var instance = params.instance,
          props = {
            instance: instance
          };

      ModalHelpers.renderModal(InstanceImageWizardModal, props, function (params) {
        actions.InstanceActions.requestImage({
          instance: instance,
          name: params.name,
          description: params.description,
          tags: params.tags,
          providerId: params.providerId,
          visibility: params.visibility,
          imageUsers: params.imageUsers,
          filesToExclude: params.filesToExclude || "",
          software: params.software || "",
          systemFiles: params.systemFiles || ""
        });
      })
    }

  };

});