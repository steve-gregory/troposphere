define(function (require) {
  "use strict";

  var Backbone = require('backbone'),
      globals = require('globals'),
      License = require('models/License');

  return Backbone.Collection.extend({
    model: License,

    url: globals.API_ROOT + '/license',

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
