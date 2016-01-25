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

            $scope.customUrl = false;

            $scope.reloadURL = function () {
                $scope.openFormCreateURL = false;
                delete $scope.alreadyURL;
                delete $scope.newShortedURL;
                $scope.customUrl = false;
            };

            $scope.openFormCustom  = function () {
                $scope.customUrl = true;
                $scope.openFormCreateURL = false;
            };

            $scope.checkToServer = function () {
                if (!$scope.url) return;
                if ($scope.checkValidUrl()) {
                    $scope.loading = true;
                    $http.post("/check/url", {url: $scope.url}).then(function (resp) {
                        $scope.loading = false;
                        if (resp.data.error) {
                            $scope.invalidURL = true;
                        } else {
                            if (resp.data.new) {
                                $scope.openFormCreateURL = true;
                            } else {
                                $scope.openFormCreateURL = false;
                                $scope.alreadyURL = resp.data;
                            }
                        }
                    });
                }
            };

            $scope.createShortURL = function () {
                $scope.loading = true;
                $http.post("/create/random", {url: $scope.url}).then(function (resp) {
                    $scope.newShortedURL = resp.data.shortURL;
                    $scope.loading = false;
                })
            }
        })

        .directive("customUrl", function($http) {
            return {
                restrict: "E",
                templateUrl: "angular/custom-url.html",
                scope: true,
                link: function($scope, elem, attrs) {
                    $scope.createCustomURL = function () {
                        $scope.loading = true;
                        if (!$scope.customizeURL) return;
                        $http.post("/create/customize", {url: $scope.customizeURL, realURL: $scope.url}).then(function (resp) {
                            $scope.loading = false;
                            if (resp.data.error){
                                $scope.errorCustom = true;
                            } else {
                                $scope.newCustomShortedURL = resp.data.shortURL;
                            }
                        })
                    }
                }
            };
        })
    ;

})();