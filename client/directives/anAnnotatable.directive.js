angular.module('annotate').directive('anAnnotatable',
  function($timeout) {
    return {
      restrict: 'A',
      scope: {
        image: '=anImage'
      },
      controller: function($scope, $attrs, $element) {

        var canvas = $element.children('.canvas');

        var image = $element.children('img');

        $timeout(function() {
          // this should not be timeout but rather
          // image load
          canvas.css({
            'height': image.css('height'),
            // 'top': image.css('top')
          })

        }, 1000)


        $scope.helpers({
          annotations: function() {
            return Annotations.find({image: $scope.image._id});
          }
        })

        image.draggable = false;

        var dragging = false;

        canvas.on('click', function(event) {
          if (event.target.className === "canvas") {

            var xPos = event.offsetX;
            var yPos = event.offsetY;

            var height = event.target.offsetHeight;
            var width = event.target.offsetWidth;

            var xPosPercent = xPos / width * 100
            var yPosPercent = yPos / height * 100

            $scope.$apply(function() {
              Annotations.insert({
                xPos: xPosPercent,
                image: $scope.image._id,
                yPos: yPosPercent,
                date: new Date(),
                comments: []
              }, function(err, annotationId) {
                if (err) console.log(err);
                console.log(annotationId);
                $scope.annotations.forEach(function(annotation) {
                  if (annotation._id === annotationId) {
                    annotation.open = true;
                  }
                })
              })
            })
          }

          // and then now add more things to the annotation
        });

        $scope.annotationOpened = function(annotationId) {
          $scope.annotations.forEach(function(annotation) {
            if (annotation._id === annotationId) {
              annotation.top = true;
            } else {
              annotation.top = false;
            }
          })
        }

        // Future functionality: drag overlay boxes
        // $element.on('mousedown', function(event) {
        //   dragging = true;
        //   console.log('annotation from here')
        // });

        // $element.on('mouseup', function(event) {
        //   dragging = false;
        //   console.log('to here')
        // });
      },
      templateUrl: 'client/templates/anAnnotatable.html'
    };
  })
