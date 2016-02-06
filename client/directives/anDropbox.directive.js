angular.module('annotate').directive('anDropbox',
  function($timeout) {
    return {
      restrict: 'A',
      transclude: true,
      scope: {
        addingImages: '=anAddingImages'
      },
      controller: function($scope, $attrs, $element) {
        $scope.addImages = (files) => {
          if (files.length > 0) {
            file = files[0];
            Images.insert(file, function(err, id) {
              if (err) console.log(err);
              $scope.$apply(function() {
                $scope.annotationEnabled = false;
              })
            });
          }
        };
      },
      templateUrl: 'client/templates/anDropbox.html'
    };
  })
