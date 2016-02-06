Meteor.subscribe('images', function() {
  return Images.find({}, {'sort': {'metadata.order': 1}});
});

Meteor.subscribe('annotations', function() {
  return Annotations.find({});
});


angular.module('annotate', [
  'angular-meteor',
  'ngFileUpload',
  'xeditable',
  'as.sortable'
  ])
.controller('UploadCtrl', function ($scope, $timeout, $location, $anchorScroll) {

  $scope.helpers({
    images: function() {
      return Images.find({});
    },
    user: function() {
      return Meteor.user();
    }
  });

  $scope.addingImages = false;

  $scope.$watch('images.length', function() {

    if ($scope.images.length === 0) {
      $scope.addingImages = true;
    }

    if ($scope.images) {
      $scope.loading = true;
      // Give it some time to process the image
      // being added. Possibly do this in a callback
      // instead?
      $timeout(function() {
        $scope.dragOrderImages = $scope.images.map(function(image) {
          return {
            url: image.url(),
            _id: image._id,
            metadata: image.metadata
          };
        });
        $scope.dragOrderImages = $scope.dragOrderImages.sort(function(a, b) {
          if (a.metadata && b.metadata) {
            return a.metadata.order - b.metadata.order;
          } else if (a.metadata) {
            return -1;
          } else if (b.metadata) {
            return -1;
          } else {
            return 0;
          }
        });
      }, 1000)

    }
  });

  $scope.deleteImage = (image) => {
    var confirmed = confirm('Are you sure?');
    if (confirmed) {
      Images.remove(image._id);
    }
  };

  $scope.goto = function(location) {
    console.log(location);
    $location.hash(location);
    $anchorScroll;
  }

  $scope.changeOrder = function() {
    var ids = $scope.dragOrderImages.map(function(image) {
      return image._id
    });
    for (var i = 0; i < ids.length; i++) {
      console.log(i, ids[i]);
      Images.update({_id: ids[i]},
                  {$set: {'metadata.order': i}},
                  { upsert: false, multi: true })
    }
  };

  $scope.sortableOptions = {
    containment: '#sortable-container',

    orderChanged: function(obj) {
      $scope.changeOrder();
    }
  };

  $scope.updateDescription = ($data, image) => {
    Images.update({_id: image._id}, {$set: {'metadata.description': $data}});
  };
});
