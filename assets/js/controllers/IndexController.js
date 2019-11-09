/*jslint browser: true*/
/*global angular, CC */
(function () {
    'use strict';
    CC.app.controller("IndexController", ["$scope", 'UsersService', "$mdSidenav", "RestService", "$cookies",
        function ($scope, usersService, $mdSidenav, restService, $cookies) {
            $scope.usersService = usersService;
            $scope.i8n = CC.i8n;
            $scope.currentTab = CC.tabs.citizen;
            $scope.tabs = CC.tabs;
            $scope.changeTab = function (tab) {
                $scope.currentTab = tab;
            };

            $scope.toggleList = function () {
                $mdSidenav("left").toggle();
            };

            $scope.logout = function () {

                restService.post(CC.ApiRoutes.logout, $scope.loginModel, function (data) {
                    $cookies.put("CITY_CHARGER_AUTH","", []);
                    location.reload();
                })
            }

        }])
})();