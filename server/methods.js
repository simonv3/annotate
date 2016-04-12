/* global Meteor, Projects */

Meteor.methods({
  incrementAnnotations: function () {
    if (Meteor.user()) {
      let project = Projects.find().fetch()[0]
      Projects.update({_id: project._id}, {$inc: {lastAnnotation: 1}}, function (err, ids) {
        if (err) throw err
      })
      project = Projects.findOne({_id: project._id})
      return project.lastAnnotation
    }
  }
})
