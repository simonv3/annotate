angular.module('annotate').directive('anAnnotation',
  function($timeout) {
    return {
      restrict: 'A',
      scope: {
        annotation: '=anAnnotation'
      },
      controller: function($scope, $element) {
        $scope.open = false;
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

        }, 500)

        // console.log(xPosPixels, yPosPixels)

        // if(xPosPixels)


        $scope.toggleAnnotation = function() {
          $scope.open = !$scope.open;
        };

        $scope.closeAnnotation = function() {
          $scope.open = false;
        };

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
