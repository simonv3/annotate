Meteor.publish(null, function() {
  return Meteor.users.find({_id: this.userId},
                           {fields: { emails: 1,
                                      profile: 1,
                                      services: 1 }});
});
