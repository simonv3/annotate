Meteor.subscribe('images', function() {
  return Images.find({});
});

Meteor.subscribe('annotations', function() {
  return Annotations.find({});
});


angular.module('annotate', [
  'angular-meteor',
  'ngFileUpload',
  'xeditable'
  ])
.controller('UploadCtrl', ['$scope', function ($scope) {

  // $reactive(this).attach($scope);

  $scope.helpers({
    images: function() {
      return Images.find({});
    },
    user: function() {
      return Meteor.user();
    }
  });

  $scope.deleteImage = (image) => {
    var confirmed = confirm('Are you sure?');
    if (confirmed) {
      Images.remove(image._id);
    }
  };

  $scope.addImages = (files) => {
    console.log(files);
    if (files.length > 0) {
      file = files[0];
      file.metadata = {
        dateAdded: new Date()
      }
      Images.insert(file, function(err, id) {
        if (err) console.log(err);
        console.log(err, id);
      });
    }
  };

  $scope.updateDescription = ($data, image) => {
    Images.update({_id: image._id}, {$set: {'metadata.description': $data}});
  };
}]);
