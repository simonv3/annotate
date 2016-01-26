angular.module('annotate', [
  'angular-meteor',
  'ngFileUpload',
  ])
.controller('UploadCtrl', ['$scope', function ($scope) {

  // $reactive(this).attach($scope);

  $scope.helpers({
    images: function() {
      return Images.find({});
    },
  });

  $scope.deleteImage = (image) => {
    var confirmed = confirm('Are you sure?');
    if (confirmed) {
      Images.remove(image._id);
    }
  }

  $scope.addImages = (files) => {
    if (files.length > 0) {
      Images.insert(files[0]);
    }
  };
}]);
