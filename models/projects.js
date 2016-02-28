Projects = new Mongo.Collection('projects')

Projects.allow({
  insert: function (userId) {
    return false
  },

  remove: function (userId, annotation) {
    return false
  },

  update: function (userId, annotation) {
    return false
  }
});
