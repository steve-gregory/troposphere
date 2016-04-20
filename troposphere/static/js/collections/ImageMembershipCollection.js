define(function(require){
  "use strict";

  var Backbone = require('backbone'),
      ImageMembership = require('models/ImageMembership'),
      globals = require('globals');

  return Backbone.Collection.extend({
    model: ImageMembership,

    url: globals.API_V2_ROOT + "/image_memberships",

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
