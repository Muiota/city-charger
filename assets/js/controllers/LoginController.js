/*jslint browser: true*/
/*global angular, CC */
(function () {
    'use strict';
    CC.app.controller("LoginController", ["$scope", "RestService", "UsersService",
        function ($scope, restService, usersService) {
            $scope.loginModel = {
                username: '',
                password: ''
            };

            $scope.signIn = function () {
                restService.post(CC.ApiRoutes.signIn, $scope.loginModel, function (data) {
                    console.log(data);

                });
            };

            $scope.signUp= function () {
                restService.post(CC.ApiRoutes.signUp, $scope.loginModel, function (data) {
                    console.log(data);
                })
            }
        }])
})();