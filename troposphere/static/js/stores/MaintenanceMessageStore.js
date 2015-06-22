define(function (require) {

  var MaintenanceMessageCollection = require('collections/MaintenanceMessageCollection'),
      BaseStore = require('stores/BetterBaseStore');

  var MaintenanceMessageStore = BaseStore.extend({
    collection: MaintenanceMessageCollection,

    find: function(){
      return BaseStore.prototype.find.apply(this, arguments);
    },

    isProviderInMaintenance: function(providerId){
      var modelArray = Object.keys(this.modelsById).map(function(key){
        return this.modelsById[key]
      }.bind(this));

      var models = new MaintenanceMessageCollection(modelArray);

      var providerMessages = models.where({provider: providerId}),
          isInMaintenance = false;

      providerMessages.forEach(function(message){
        if(message.get('disable_login') === true) {
          isInMaintenance = true;
        }
      });

      return isInMaintenance;
    }

  });

  var store = new MaintenanceMessageStore();

  return store;

});
