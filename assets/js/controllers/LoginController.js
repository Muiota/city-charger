/*jslint browser: true*/
/*global angular, CC */
(function () {
    'use strict';
    CC.app.controller("LoginController", ["$scope", "RestService",
        function ($scope, restService) {
            $scope.loginModel = {
                username: '',
                password: ''
            };

            $scope.signIn = function () {
                restService.post(CC.ApiRoutes.signIn, $scope.loginModel, function (data) {
                    console.log(data);
                })
            }


        }])
})();