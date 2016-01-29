Images = new FS.Collection("images", {
  stores: [
    new FS.Store.GridFS("original")
  ],

  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});

Images.allow({
  insert: function (userId) {
    var permissions = Meteor.users.find({_id: userId})
      .fetch()[0].services.sandstorm.permissions;
    return permissions.indexOf('owner') > -1 ? true : false;
  },

  remove: function (userId) {
    var permissions = Meteor.users.find({_id: userId})
      .fetch()[0].services.sandstorm.permissions;
    return permissions.indexOf('owner') > -1 ? true : false;
  },

  download: function (userId) {
    return true;
  },

  update: function (userId) {
    var permissions = Meteor.users.find({_id: userId})
      .fetch()[0].services.sandstorm.permissions;
    return permissions.indexOf('owner') > -1 ? true : false;
  }
});
