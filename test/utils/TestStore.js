define(function(require) {
  "use strict";

  var BaseStore = require('stores/BetterBaseStore'),
      TestCollection = require('./TestCollection');

  return BaseStore.extend({
    collection: TestCollection
  });

});
