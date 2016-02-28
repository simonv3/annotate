/* global Meteor, Projects */

Meteor.startup(function () {
  if (Projects.find().count() === 0) {
    const project = {
      'lastAnnotation': 0
    }
    Projects.insert(project)
  }
})
