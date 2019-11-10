/*jslint browser: true*/
/*global angular, CC */
(function () {
    'use strict';
    CC.app.controller("PackagesController", ["$scope", "RestService", "PackagesService",
        function ($scope, restService, packagesService) {

            $scope.i8n = CC.i8n;
            $scope.packagesService = packagesService;

            $scope.reload = function () {
                packagesService.reloadUserPackages();
            };
        }])
})();