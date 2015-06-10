define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
      LicenseType = require('models/LicenseType'),
      globals = require('globals');

  return Backbone.Collection.extend({
    model: LicenseType,

    url: globals.API_V2_ROOT + "/license_types",

    parse: function (response) {
      this.meta = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };

      return response.results;
    }

  });

});
