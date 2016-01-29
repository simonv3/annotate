Meteor.publish('annotations', function() {
  return Annotations.find({});
});


