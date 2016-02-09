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
              Images.insert(file, function(err, id) {
                if (err) console.log(err);
                console.log($scope.onImageAdded)
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
