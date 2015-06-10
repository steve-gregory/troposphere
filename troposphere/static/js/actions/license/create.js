define(function (require) {
  'use strict';

  var LicenseConstants = require('constants/LicenseConstants'),
      License = require('models/License'),
      actions = require('actions'),
      Utils = require('../Utils');

  return {

    create: function(params){
      if(!params.title) throw new Error("Missing title");
      if(!params.license_type) throw new Error("Missing license_type");
      if(!params.license_text) throw new Error("Missing license_text");

      var title = params.title,
          license_type = params.license_type,
          license_text = params.license_text;

      var license = new License({
        title: name,
        license_type: license_type,
        license_text: license_text,
        access_list: []
      });

      // Add the tag optimistically
      Utils.dispatch(LicenseConstants.ADD_LICENSE, {license: license});

      license.save().done(function () {
        Utils.dispatch(LicenseConstants.UPDATE_LICENSE, {license: license});
      }).fail(function () {
        Utils.dispatch(LicenseConstants.REMOVE_LICENSE, {license: license});
      });
    }

  };

});
