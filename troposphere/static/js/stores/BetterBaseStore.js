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
    //
    // isFetching: True or false depending on whether this.models is being
    // fetch from the server. Used to prevent multiple server calls for the same data.
    //this.models = new Backbone.Collection();
    //this.isFetching = false;

    // modelsById: dictionary that uses ids as keys and stores the resulting model as the value
    //
    // isFetchingModel: dictionary of ids as keys and individual models as the values.  Used
    // when we need to make sure to fetch an individual model
    this.modelsById = {};
    this.isFetchingModel = {};

    // modelsByQuery: dictionary that uses query strings as keys and stores the resulting
    // collection as the value
    //
    // isFetchingQuery: stores query strings as keys and denotes whether that data is already
    // being fetched from the server. Used to prevent multiple server calls for the same data.
    this.modelsByQuery = {};
    this.isFetchingQuery = {};

    this.initialize.apply(this, arguments);
  };

  _.extend(Store.prototype, Backbone.Events, {

    //
    // Utility functions
    //

    _convertLocalQueryParamsToServerQueryParams: function(queryParams){
      if(this.disableServerParamMapping) return queryParams;

      var queryParamMap = this.queryParamMap;
      if(!this.queryParamMap) {
        throw new Error(
          "must define a queryParamMap in order to make server side filtering calls: " + JSON.stringify(queryParams)
        );
      }

      var serverParams = {};
      Object.keys(queryParams).forEach(function(localParam){
        var value = queryParams[localParam];
        var serverParam = queryParamMap[localParam];
        if(!serverParam) throw new Error("queryParamMap missing server mapping for: " + localParam);
        serverParams[serverParam] = value;
      });
      return serverParams;
    },

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

    add: function(m){
      // todo: store model by cid if no id
      var modelData = m.toJSON();
      var model = this.modelsById[m.id];
      if(model){
        model.set(modelData);
      }else{
        this.modelsById[m.id] = m;
      }
    },

    update: function(m){
      // todo: check if model is already stored by cid and store by id instead if it has an id
      var modelData = m.toJSON();
      var model = this.modelsById[m.id];
      if(!model){
        console.warn("attempting to update a model without an id: ignoring request", m);
        return;
      }
      model.set(modelData);
    },

    remove: function(m){
      if(!m.id) {
        console.warn("attempting to remove a model without an id: ignoring request", m);
        return;
      }
      delete this.modelsById[m.id];
    },

    // --------------
    // Core functions
    // --------------

    // called as the last step in the constructor - should be overridden if you need to
    // modify any of the default store values (this.models, pollingFrequency, etc.)
    initialize: function(){},

    // Fetch the first page of data from the server
    _fetchCollection: function () {
      throw new Error("don't use me bro!");

      if (!this.models && !this.isFetching) {
        this.isFetching = true;
        var models = new this.collection();

        models.fetch({
          url: _.result(models, 'url')
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

    _fetchModel: function(modelId){
      // don't fetch the model again if we're already fetching it
      if(!this.isFetchingModel[modelId]){

        // signal that we're fetching the model
        this.isFetchingModel[modelId] = true;

        // instantiate the model and fetch it
        var model = new this.collection.prototype.model({
          id: modelId
        });
        model.fetch().done(function(){
          // signal that we're done fetching the model
          this.isFetchingModel[modelId] = false;

          // add the model to the id dictionary
          this.modelsById[model.id] = model;

          // let components know we have new data
          this.emitChange();
        }.bind(this));
      }
    },

    // ------------------
    // Public API methods
    // ------------------

    find: function(){
      var queryResults = this.modelsByQuery["empty"];
      if(queryResults) return queryResults;

      if(!this.isFetchingQuery["empty"]) {
        // signal that we are currently fetching this query to prevent it from being fetched multiple times
        this.isFetchingQuery["empty"] = true;

        // instantiate the collection and fetch it
        var models = new this.collection();
        models.fetch({
          url: _.result(models, 'url')
        }).done(function () {
          // signal that we have finished fetching this query
          this.isFetchingQuery["empty"] = false;

          // add models to the query dictionary
          this.modelsByQuery["empty"] = models;

          // add models to the id dictionary
          models.forEach(function(model){
            this.modelsById[model.id] = model;
          }.bind(this));

          // let components know we have new data
          this.emitChange();
        }.bind(this));
      }
    },

    findMore: function(){
      var queryResults = this.modelsByQuery["empty"];

      if(!queryResults) {
        console.warn(
          "store.findMore called before store.find: delegating behavior to store.find to get initial results"
        );
        return this.find();
      }

      if(!queryResults.meta) {
        throw new Error(
          "missing 'meta' field on collection: you need to set this in the collections " +
          "parse method before you can call store.findMore"
        );
      }

      if(!queryResults.meta.next) {
        console.warn(
          "there are no more results for this collection in store.findMore: delegating behavior to store.find"
        );
        return this.find();
      }

      if(!this.isFetchingQuery["empty"]) {
        // signal that we are currently fetching this query to prevent it from being fetched multiple times
        this.isFetchingQuery["empty"] = true;

        // instantiate the collection and fetch it
        var models = new this.collection();
        models.fetch({
          url: queryResults.meta.next
        }).done(function () {
          // signal that we have finished fetching this query
          this.isFetchingQuery["empty"] = false;

          // add models to the query dictionary
          queryResults.add(models.models);

          // add models to the id dictionary
          models.forEach(function(model){
            this.modelsById[model.id] = model;
          }.bind(this));

          // let components know we have new data
          this.emitChange();
        }.bind(this));
      }

      return queryResults;
    },

    findMoreWhere: function(queryParams){
      queryParams = queryParams || {};
      if(Object.keys(queryParams).length === 0) {
        console.warn("store.findMoreWhere called without arguments: delegating behavior to store.findMore");
        return this.findMore();
      }

      // Build the query string
      var queryString = buildQueryStringFromQueryParams(queryParams);

      // Return the query if it already exists
      var queryResults = this.modelsByQuery[queryString];

      if(!queryResults) {
        console.warn(
          "store.findMoreWhere called before store.findWhere: delegating behavior to store.findWhere to get initial results"
        );
        return this.findWhere(queryParams);
      }

      if(!queryResults.meta) {
        throw new Error(
          "missing 'meta' field on collection: you need to set this in the collections " +
          "parse method before you can call store.findMoreWhere"
        );
      }

      if(!queryResults.meta.next) {
        console.warn(
          "there are no more results for this collection in store.findMoreWhere: delegating behavior to store.findWhere"
        );
        return this.findWhere(queryParams);
      }

      if(!this.isFetchingQuery[queryString]) {
        // signal that we are currently fetching this query to prevent it from being fetched multiple times
        this.isFetchingQuery[queryString] = true;

        // instantiate the collection and fetch it
        var models = new this.collection();
        models.fetch({
          url: queryResults.meta.next
        }).done(function () {
          // signal that we have finished fetching this query
          this.isFetchingQuery[queryString] = false;

          // add models to the query dictionary
          queryResults.add(models.models);

          // add models to the id dictionary
          models.forEach(function(model){
            this.modelsById[model.id] = model;
          }.bind(this));

          // let components know we have new data
          this.emitChange();
        }.bind(this));
      }

      return queryResults;
    },

    findWhere: function(queryParams){
      queryParams = queryParams || {};
      if(Object.keys(queryParams).length === 0) {
        console.warn("store.findWhere called without arguments: delegating behavior to store.find");
        return this.find();
      }

      // Build the query string
      var queryString = buildQueryStringFromQueryParams(queryParams);

      // Return the query if it already exists
      var queryResults = this.modelsByQuery[queryString];
      if(queryResults) return queryResults;

      var serverQueryParams = this._convertLocalQueryParamsToServerQueryParams(queryParams, this.queryParamMap);
      var serverQueryString = buildQueryStringFromQueryParams(serverQueryParams);

      if(!this.isFetchingQuery[queryString]) {
        // signal that we are currently fetching this query to prevent it from being fetched multiple times
        this.isFetchingQuery[queryString] = true;

        // instantiate the collection and fetch it
        var models = new this.collection();
        models.fetch({
          url: _.result(models, 'url') + serverQueryString
        }).done(function () {
          // signal that we have finished fetching this query
          this.isFetchingQuery[queryString] = false;

          // add models to the query dictionary
          this.modelsByQuery[queryString] = models;

          // add models to the id dictionary
          models.forEach(function(model){
            this.modelsById[model.id] = model;
          }.bind(this));

          // let components know we have new data
          this.emitChange();
        }.bind(this));
      }

    },

    findOne: function (modelId) {
      var model = this.modelsById[modelId];
      if(!model) return this._fetchModel(modelId);
      return model;
    },

    findOneWhere: function (queryParams) {
      queryParams = queryParams || {};
      if(Object.keys(queryParams).length === 0) {
        throw new Error("store.findOneWhere called without arguments: not allowed");
      }

      throw new Error("not implemented yet");

      var queryString = buildQueryStringFromQueryParams(queryParams);
      if(!queryString) queryString = "empty";
      var models = this.find(modelId);
      if(models) return models.findWhere(queryParams);
    }

  });

  Store.extend = Backbone.Model.extend;

  return Store;
});
