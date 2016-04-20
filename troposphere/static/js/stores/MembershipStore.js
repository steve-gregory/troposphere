define(function (require) {

  var BaseStore = require('stores/BaseStore'),
      MembershipCollection = require('collections/MembershipCollection');

  var MembershipStore = BaseStore.extend({
    collection: MembershipCollection,

    exists: function (modelId) {
      if(!this.models) return this.fetchModels();
      return this.models.get(modelId) != null;
    },

    queryParams: {
      page_size: 6000
    },

    getMembershipsFromList: function (usernameList) {
      if(!this.models) throw new Error("Must fetch users before calling getMembershipsFromList");
      var users = usernameList.map(function(username){
        var user = this.models.findWhere({username: username});
        return user;
      }.bind(this));

      return new MembershipCollection(users);
    }

  });

  var store = new MembershipStore();

  return store;
});
