/*jslint browser: true*/
/*global angular, CC */
(function () {
    'use strict';
    CC.app.controller("IndexController", ["$scope", 'UsersService', "$mdSidenav", "RestService", "$cookies",
        "$mdDialog",
        function ($scope, usersService, $mdSidenav, restService, $cookies, $mdDialog) {
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
                    $cookies.put("CITY_CHARGER_AUTH", "", []);
                    location.reload();
                })
            };

            function DialogController($scope, $mdDialog) {
                $scope.i8n = CC.i8n;

                $scope.items = [{title: "AA battery", icon: "svg-battery"},
                    {title: "AAA battery", icon: "svg-battery"},
                    {title: "AA battery", icon: "svg-battery"}];

                $scope.hide = function () {
                    $mdDialog.hide();
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.answer = function (answer) {
                    $mdDialog.hide(answer);
                };
            }

            $scope.showCreatePackageDialog = function (ev) {
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: "/templates/createPackage.template.html",
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: false // Only for -xs, -sm breakpoints.
                })
                    .then(function (answer) {
                        $scope.status = 'You said the information was "' + answer + '".';
                    }, function () {
                        $scope.status = 'You cancelled the dialog.';
                    });
            };

        }])
})();