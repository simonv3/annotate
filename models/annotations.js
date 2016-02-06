Annotations = new Mongo.Collection("annotations");

Annotations.allow({
  insert: function (userId) {
    var permissions = Meteor.users.find({_id: userId})
      .fetch()[0].services.sandstorm.permissions;
    return true;

    // return (userId ? true : false);
  },

  remove: function (userId) {
    var permissions = Meteor.users.find({_id: userId})
      .fetch()[0].services.sandstorm.permissions;

    if (permissions.indexOf('owner') > -1)
      return true;
    return false;
  },

  update: function (userId, annotation) {
    console.log(annotation)
    var permissions = Meteor.users.find({_id: userId})
      .fetch()[0].services.sandstorm.permissions;
    return true;
    // return (userId ? true : false);
  }
});
