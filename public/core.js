// public/core.js
function mainController($scope, $http) {
  $scope.formData = {};
  $http.get('/api/createindex')
  .success((data) => {
    $scope.error = false;
    $scope.success = false;
    $scope.invertedIndex = data;
    $scope.filelength = Object.keys(data).length;
  })
  .error((data) => {
    $scope.success = false;
    $scope.error = data.message;
  });
    // when submitting the add form, send the fileDetails{name} to the node API
  $scope.createIndex = function () {
    if ($scope.formData.fileDetails.data === 'data:') {
      $scope.success = false;
      $scope.error = 'The File is empty';
      throw ('Empty File');
    }

    $http.post('/api/createindex', $scope.formData.fileDetails)
    .success((data) => {
      $scope.formData = {}; // clear the form so our user is ready to enter another
      $scope.invertedIndex = data;
      $scope.filelength = Object.keys(data).length;
      $scope.error = false;
      $scope.success = 'Success: Index created successfully!';
    })
    .error((data) => {
      $scope.success = false;
      $scope.error = data.message;
      
    });
  };
  // submit search terms and send FormData {file, SeachTerms} to node API
  $scope.searchIndex = function () {
    $http.post('/api/search', $scope.formData)
    .success((data) => {
      $scope.formData = {}; // clear the form so our user is ready to enter another
      $scope.searchIndexes = data;
      console.log($scope.searchIndexes);
    })
    .error((data) => {
      $scope.success = false;
      console.log(`Error: ${data}`);
    });
  };
}
mainController.$inject = ['$scope', '$http'];
angular.module('cpInvertedIndex', ['ng-file-model']).controller('mainController', mainController);
