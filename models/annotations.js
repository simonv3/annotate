Annotations = new Mongo.Collection("annotations");

Annotations.allow({
  insert: function (userId) {
    var permissions = Meteor.users.find({_id: userId})
      .fetch()[0].services.sandstorm.permissions;
    return true;

    // return (userId ? true : false);
  },

  remove: function (userId, annotation) {
    var permissions = Meteor.users.find({_id: userId})
      .fetch()[0].services.sandstorm.permissions;
    console.log(annotation.owner, userId, annotation.owner === userId);
    if (permissions.indexOf('owner') > -1 || userId === annotation.owner)
      return true;
    return false;
  },

  update: function (userId, annotation) {
    var permissions = Meteor.users.find({_id: userId})
      .fetch()[0].services.sandstorm.permissions;
    return true;
    // return (userId ? true : false);
  }
});
