define(function(require) {
  "use strict";

  var Backbone = require('backbone'),
      TestModel = require('./TestModel');

  return Backbone.Collection.extend({
      model: TestModel,

      url: "/api/tests",

      parse: function(attr){
        this.meta = {
          count: attr.count,
          next: attr.next,
          previous: attr.previous
        };
        return attr.results;
      }
    });

});
