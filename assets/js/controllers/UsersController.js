/*jslint browser: true*/
/*global angular, CC */
(function () {
    'use strict';
    CC.app.controller("UsersController", ["$scope", 'UsersService', '$mdBottomSheet', '$mdSidenav',
        function ($scope, usersService, $mdBottomSheet, $mdSidenav) {
            $scope.selected = null;
            $scope.users = [];
            $scope.activate = function () {
                usersService.loadAllUsers()
                    .then(function (users) {
                        $scope.users = users;
                        $scope.selected = users[4];
                    });
            };
            $scope.activate();

            $scope.selectUser = function (user) {
                $scope.selected = user;
            };

            $scope.toggleList = function () {
                $mdSidenav("left").toggle();
            };

            $scope.share = function (selectedUser) {
                $mdBottomSheet.show({
                    controller: ["$scope", "$mdBottomSheet", function ($scope, $mdBottomSheet) {
                        $scope.user = selectedUser;
                        $scope.items = [
                            {name: 'Phone', icon: 'phone', icon_url: '/images/phone.svg'},
                            {name: 'Twitter', icon: 'twitter', icon_url: '/images/twitter.svg'},
                            {name: 'Google+', icon: 'google_plus', icon_url: '/images/google_plus.svg'},
                            {name: 'Hangout', icon: 'hangouts', icon_url: '/images/hangouts.svg'}
                        ];

                        $scope.performAction = function (action) {
                            $mdBottomSheet.hide();
                        }
                    }],
                    templateUrl: "/templates/contactSheet.template.html",
                    parent: angular.element(document.getElementById('content'))
                });
            }
        }])
})();