angular.module('annotate').directive('anAnnotation',
  function($timeout) {
    return {
      restrict: 'A',
      scope: {
        annotation: '=anAnnotation',
        annotationOpened: '&',
        index: '=anIndex'
      },
      controller: function($scope, $element) {
        $scope.open = false;

        $scope.$watch('annotation.open', function(open) {
          // only use this watch to open an annotation,
          // not to close it
          if (open) {
            $scope.openAnnotation();
          }
          if ($scope.annotation) {
            $scope.annotationOpened({ annotationId: $scope.annotation._id });
          }

        });

        var width = parseInt(angular.element('.annotation-indicator').css('width'), 10)

        var annotationElement = $element.children('.annotation')

        var image = $element.parent().parent().children('img')[0];

        $timeout(function() {
          var xPosPixels = annotationElement[0].offsetLeft;
          var yPosPixels = annotationElement[0].offsetTop;

          if (xPosPixels + 320 > image.offsetWidth) { // TODO -> 320 shouldn't be hardcoded.
            $scope.floatRight = true;
          }
          if (yPosPixels + 200 > image.offsetHeight) {
            $scope.floatBottom = true;
          }

        }, 500);

        // console.log(xPosPixels, yPosPixels)

        // if(xPosPixels)

        $scope.openAnnotation = function() {
          $scope.setAnnotationOpenState(true)
        }

        $scope.toggleAnnotation = function() {
          $scope.setAnnotationOpenState(!$scope.open)
        };

        $scope.closeAnnotation = function() {
          $scope.setAnnotationOpenState(false)
        };

        $scope.setAnnotationOpenState = function(set) {
          $scope.open = set;
          $scope.annotation.open = set;
        }

        $scope.deleteAnnotation = function() {
          Annotations.remove({_id: $scope.annotation._id});
        };

        $scope.addComment = function() {
          if ($scope.newComment) {

            console.log(Meteor.user())
            if (Meteor.user()) {
              console.log(Meteor.user())
            }

            Annotations.update({_id: $scope.annotation._id},
              {
                '$push':
                  {'comments': {
                    'comment': $scope.newComment,
                    'date': new Date(),
                    'author': Meteor.user()
                  }
                }
              })
          }
          $scope.newComment = '';
        }
      },
      templateUrl: 'client/templates/anAnnotation.html'
    }
  })
