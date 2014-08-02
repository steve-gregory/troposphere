define(
  [
    'underscore',
    'backbone',
    'models/Instance',
    'models/Volume',
    'globals'
  ],
  function (_, Backbone, Instance, Volume, globals) {

    var statics = {
      objectType: function (model) {
        var objectType;
        if (model instanceof Instance)
          objectType = 'instance';
        else if (model instanceof Volume)
          objectType = 'volume';
        else
          throw "Unknown model type";
        return objectType;
      }
    };

    var Project = Backbone.Model.extend({

      urlRoot: globals.API_ROOT + "/project",

      url: function () {
        var url = Backbone.Model.prototype.url.apply(this) + globals.slash();
        return url;
      },

      defaults: {
        name: 'No name provided',
        description: 'No description provided'
      },

      parse: function (response) {
        response.start_date = new Date(response.start_date);

        return response;
      },

      isEmpty: function () {
        var instances = this.get('instances');
        var volumes = this.get('volumes');
        var hasNoInstances = instances ? instances.isEmpty() : true;
        var hasNoVolumes = volumes ? volumes.isEmpty() : true;

        return hasNoInstances && hasNoVolumes;
      },

      canBeDeleted: function () {
        return this.get('name') !== 'Default';
      },

      objectUrl: function (model) {
        var objectType = Project.objectType(model);
        return this.url() + objectType + '/' + model.id + '/';
      }

    }, statics);

    return Project;

  });
