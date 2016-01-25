"use strict";

(function () {

    angular.module("shortURL.app", [
    ])
        .controller("shortUrl.controller", function($scope, $http) {

            $scope.checkValidUrl = function () {
                if (!$scope.url) return true;
                if ($scope.url.substring(0,8) == 'https://' || $scope.url.substring(0,7) == 'http://') {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.checkToServer = function () {
                if ($scope.checkValidUrl()) {
                    $http.post("/check-url", {url: $scope.url});
                }
            }
        })
    ;

})();