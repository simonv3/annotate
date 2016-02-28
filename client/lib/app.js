
angular.module('annotate', [
  'angular-meteor',
  'ngFileUpload',
  'xeditable',
  'as.sortable'
  ])
.controller('UploadCtrl', function ($scope, $timeout, $location, $anchorScroll) {

  $scope.loading = true;

  $scope.subscribe('images')
  $scope.subscribe('projects')
  $scope.subscribe('annotations')

  $scope.helpers({
    images: function() {
      return Images.find({}, {'sort': {'metadata.order': 1}});
    },
    user: function() {
      return Meteor.user();
    }
  });

  $scope.addingImages = false;

  $scope.$watch('images.length', function() {

    $timeout(function() {
      if ($scope.images.length === 0) {
        $scope.addingImages = true;
      }
      $scope.loading = false;
    }, 2000)

    if ($scope.images) {
      // Give it some time to process the image
      // being added. Possibly do this in a callback
      // instead?
      $timeout(function() {
        $scope.mapDragOrderImages();
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

  // this is a bit of hack eh.
  // basically this function checks that url() of
  // an image isn't null, and then adds it to the array
  // if it is, try again 2 seconds later!
  $scope.mapDragOrderImages = function() {

    $scope.dragOrderImages = $scope.images.map(function(image) {
      if (!image.url()) {
        // wait 2 seconds and try again
        $timeout(function() {
          $scope.mapDragOrderImages();
        }, 2000)

      } else {
        return {
          url: image.url(),
          _id: image._id,
          metadata: image.metadata
        };
      }
    });
  }

  $scope.deleteImage = (image) => {
    var confirmed = confirm('Are you sure?');
    if (confirmed) {
      Images.remove(image._id, function() {
        if ($scope.images.length === 0) {
          $scope.addingImages = true;
        }
      });
    }
  };

  $scope.goto = function(location) {
    $location.hash(location);
    $anchorScroll;
  }

  $scope.changeOrder = function() {
    var ids = $scope.dragOrderImages.map(function(image) {
      return image._id
    });
    for (var i = 0; i < ids.length; i++) {
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
