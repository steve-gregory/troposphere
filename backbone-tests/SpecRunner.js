require.config({
  baseUrl: '/backbone-tests/',
  paths: {
    'jquery'      : 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
    'underscore'  : 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min',
    'backbone'    : 'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
    //'mocha'       : 'https://cdnjs.cloudflare.com/ajax/libs/mocha/2.2.5/mocha.min',
    //'chai'        : 'https://cdnjs.cloudflare.com/ajax/libs/chai/3.0.0/chai.min',
    'models'      : '/app/models'
  }
});

define(function(require) {
  //var chai = require('chai');
  //var mocha = require('mocha');
  require('jquery');

  // Chai
  var should = chai.should();

  mocha.setup('bdd');

  require([
    'specs/model-tests.js'
  ], function(require) {
    mocha.run();
  });

});