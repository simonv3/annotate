/* global angular, Annotations, Meteor */

angular.module('annotate').directive('anAnnotatable',
  function ($timeout, $interval) {
    return {
      restrict: 'A',
      scope: {
        image: '=anImage',
        canAnnotate: '=',
        showAnnotations: '='
      },
      controller: function ($scope, $attrs, $element) {
        var canvas = $element.children('.canvas')
        var image = $element.children('img')

        var recalcHeightAndWidth = function () {
          var image = $element.children('img')
          var height = image.css('height')
          var width = image.css('width')
          canvas.css({
            'height': height,
            'width': width
          })
        }

        $interval(function () {
          // this should not be timeout but rather
          // image load. This will probably make some browsers
          // upset
          recalcHeightAndWidth()
        }, 500)

        // $scope.$watch('showAnnotations', function (aft, bef) {
        //   if (aft) {
        //     $timeout(function () {
        //       recalcHeightAndWidth()
        //     }, 100)
        //   }
        // })

        // $scope.$watch('canAnnotate', function () {
        //   recalcHeightAndWidth()
        // })

        $scope.helpers({
          annotations: function () {
            return Annotations.find({image: $scope.image._id}, {'sort': {'date': 1}})
          }
        })

        image.draggable = false

        canvas.on('click', function (event) {
          if (event.target.className.indexOf('canvas') > -1) {
            var xPos = event.offsetX
            var yPos = event.offsetY

            var height = event.target.offsetHeight
            var width = event.target.offsetWidth

            var xPosPercent = xPos / width * 100
            var yPosPercent = yPos / height * 100

            $scope.$apply(function () {
              Meteor.call('incrementAnnotations', function (err, next) {
                if (err) console.log(err)
                Annotations.insert({
                  image: $scope.image._id,
                  xPos: xPosPercent,
                  yPos: yPosPercent,
                  date: new Date(),
                  owner: Meteor.userId(),
                  number: next,
                  comments: []
                }, function (err, annotationId) {
                  if (err) console.log(err)

                  $scope.annotations.forEach(function (annotation) {
                    if (annotation._id === annotationId) {
                      annotation.open = true
                    }
                  })
                })
                console.log('post-increment', next)
              })
            })
          }
          // and then now add more things to the annotation
        })

        $scope.annotationOpened = function (annotationId) {
          $scope.annotations.forEach(function (annotation) {
            if (annotation._id === annotationId) {
              annotation.top = true
            } else {
              annotation.top = false
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
    }
  })
