define(function (require) {

  var Backbone = require('backbone'),
      globals = require('globals');

  return Backbone.Model.extend({
    urlRoot: globals.API_ROOT + "/license"
  });

});
