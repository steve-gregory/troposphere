define(function(require) {
  "use strict";

  var _ = require('underscore'),
      Backbone = require('backbone');

  var CHANGE_EVENT = 'change';

  function buildQueryStringFromQueryParams(queryParams){
    var queryString = Object.keys(queryParams).sort().map(function(key, index){
      return key + "=" + queryParams[key];
    }.bind(this)).join("&");
    queryString = queryString ? "?" + queryString : queryString;
    return queryString;
  }

  var Store = function(attributes, options) {
    if(!this.collection) throw "collection must be defined";

    // models: primary local cache, stores a collection of models
    this.models = new Backbone.Collection();
    this.modelsById = {};

    // isFetching: True or false depending on whether this.models is being
    // fetch from the server. Used to prevent multiple server calls for the same data.
    this.isFetching = false;

    // isFetchingQuery: stores query strings as keys and denotes whether that data is already
    // being fetched from the server. Used to prevent multiple server calls for the same data.
    //
    // queryModels: dictionary that uses query strings as keys and stores the resulting
    // collection as the value
    this.isFetchingQuery = {};
    this.queryModels = {};

    // isFetchingModel: dictionary of ids as keys and individual models as the values.  Used
    // when we need to make sure to fetch an individual model
    this.isFetchingModel = {};

    this.initialize.apply(this, arguments);
  };

  _.extend(Store.prototype, Backbone.Events, {

    // ---------------
    // Event listeners
    // ---------------

    addChangeListener: function(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
      this.off(CHANGE_EVENT, callback);
    },

    emitChange: function() {
      this.trigger(CHANGE_EVENT);
    },

    // --------------
    // CRUD functions
    // --------------

    add: function(model){
      this.models.add(model);
    },

    update: function(model){
      var existingModel = this.models.get(model);
      if(existingModel) {
        this.models.add(model, {merge: true});
      }else{
        console.error("Model doesn't exist: " + model.id || model.cid);
      }
    },

    remove: function(model){
      this.models.remove(model);
    },

    // --------------
    // Core functions
    // --------------

    // called as the last step in the constructor - should be overridden if you need to
    // modify any of the default store values (this.models, pollingFrequency, etc.)
    initialize: function(){},

    // Fetch the first page of data from the server
    fetchModels: function () {
      if (!this.models && !this.isFetching) {
        this.isFetching = true;
        var models = new this.collection();
        var queryString = "";

        // Build the query string if queryParameters have been provided
        if(this.queryParams){
          queryString = buildQueryStringFromQueryParams(this.queryParams);
        }

        models.fetch({
          url: _.result(models, 'url') + queryString
        }).done(function(){
          this.isFetching = false;
          this.models = models;

          // add models to the id dictionary
          models.forEach(function(model){
            this.modelsById[model.id] = model;
          }.bind(this));

          if(this.pollingEnabled) {
            this.models.each(this.pollNowUntilBuildIsFinished.bind(this));
          }
          this.emitChange();
        }.bind(this));
      }
    },

    fetchModel: function(modelId){
      if(!this.isFetchingModel[modelId]){
        this.isFetchingModel[modelId] = true;
        var model = new this.collection.prototype.model({
          id: modelId
        });
        model.fetch().done(function(){
          this.isFetchingModel[modelId] = false;
          this.models.add(model);
          this.modelsById[model.id] = model;
          this.emitChange();
        }.bind(this));
      }
    },

    // ------------------
    // Public API methods
    // ------------------

    find: function(options){
      options = options || {};
      var queryParams = options.where || {};

      // Build the query string
      var queryString = buildQueryStringFromQueryParams(queryParams);

      queryString = queryString || "empty";
      var queryResults = this.queryModels[queryString];
      var emptyQueryResults = this.queryModels["empty"];

      if(queryResults) return queryResults;

      if(emptyQueryResults && !emptyQueryResults.meta) throw "meta field must be specified";

      if(emptyQueryResults && !emptyQueryResults.meta.next){
        return new this.collection(emptyQueryResults.where(queryParams));
      }

      if(!this.isFetchingQuery[queryString]) {
        this.isFetchingQuery[queryString] = true;
        var models = new this.collection();
        var url = queryString === "empty" ? models.url : models.url + queryString;
        models.fetch({
          url: url
        }).done(function () {
          this.isFetchingQuery[queryString] = false;
          this.queryModels[queryString] = models;

          // add models to the id dictionary
          models.forEach(function(model){
            this.modelsById[model.id] = model;
          }.bind(this));

          this.models.add(models.models);
          this.emitChange();
        }.bind(this));
      }
    },

    findOne: function (modelId) {
      if(typeof modelId !== "object") {
        var model = this.modelsById[modelId];
        if(!model) return this.fetchModel(modelId);
        return model;
      }else{
        var queryParams = modelId.where;
        var queryString = buildQueryStringFromQueryParams(queryParams);
        if(!queryString) queryString = "empty";
        var models = this.find(modelId);
        if(models) return models.findWhere(queryParams);
      }
    }

  });

  Store.extend = Backbone.Model.extend;

  return Store;
});
