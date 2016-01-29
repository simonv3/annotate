Annotations = new Mongo.Collection("annotations");

Annotations.allow({
  insert: function (userId) {
    return true;
    return (userId ? true : false);
  },

  remove: function (userId) {
    return true;
    return (userId ? true : false);
  },

  update: function (userId) {
    return true;
    return (userId ? true : false);
  }
});
