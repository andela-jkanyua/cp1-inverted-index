// public/core.js
var cpInvertedIndex = angular.module('cpInvertedIndex',  ["ng-file-model"]);

function mainController($scope, $http) {
    $scope.formData = {};

    $http.get('/api/createindex')   
        .success(function(data) {
            $scope.invertedIndex = data;
            $scope.filelength = Object.keys(data).length;
            console.log(data);

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the fileDetails{name} to the node API
    $scope.createIndex = function() {

        $http.post('/api/createindex', $scope.formData.fileDetails)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.invertedIndex = data;
                $scope.filelength = Object.keys(data).length;
                console.log(data);
            })
            .error(function(data) {
                console.log($scope);
                console.log('Error: ' + data);
            });
    };

    $scope.searchIndex = function() {
        $http.post('/api/search', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.searchIndexes = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };


}