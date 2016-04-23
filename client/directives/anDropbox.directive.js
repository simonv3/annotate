angular.module('annotate').directive('anDropbox',
  function($timeout) {
    return {
      restrict: 'A',
      transclude: true,
      scope: {
        addingImages: '=anAddingImages',
        onImageAdded: '&'
      },
      controller: function($scope, $attrs, $element) {

        $scope.addImages = (files) => {
          if (files.length > 0) {
            files.forEach(function(file) {

              // When uploading a file, let's first see if we can find the
              // same file previously

              var existingImages = Images.find(
                {'original.name': file.name},
                {'sort': {'uploadedAt': -1}}
              ).fetch()

              // Let's also check what the most recent
              // highest ordering is, and add it to the end.

              var highestOrder = Images.find(
                {},
                {'sort': {'metadata.order': -1}}
              ).fetch()[0].metadata.order

              Images.insert(file, function(err, newFile) {
                if (err) console.log('error insterting image', err);

                let updateSetForNewFile = {
                  'metadata.owner': Meteor.user(),
                  'metadata.order': highestOrder + 1
                }

                if (existingImages.length > 0) {
                  existingImages.forEach(function(img) {
                    Images.update({_id: img._id},
                      {$set: {'metadata.newest': newFile._id}})
                  })

                  Images.update({_id: existingImages[0]._id},
                    {$set: {'metadata.next': newFile._id}})

                  updateSetForNewFile['metadata.previous'] = existingImages[0]._id
                  if (existingImages[0].metadata) {
                    updateSetForNewFile['metadata.description'] = existingImages[0].metadata.description
                    updateSetForNewFile['metadata.order'] = existingImages[0].metadata.order
                  }
                }

                Images.update({_id: newFile._id},
                    {$set: updateSetForNewFile})

                $scope.$apply(function() {
                  $timeout(function() {
                    $scope.onImageAdded();
                  }, 3000)
                  $scope.annotationEnabled = false;
                })
              });
            })

          }
        };
      },
      templateUrl: 'client/templates/anDropbox.html'
    };
  })
