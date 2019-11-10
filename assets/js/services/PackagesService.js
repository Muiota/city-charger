/*jslint browser: true*/
/*global angular, CC */
(function () {
        'use strict';
        CC.app.service('PackagesService', ['RestService', function (restService) {

            let userPackages = [];

            function reloadUserPackages() {
                restService.post(CC.ApiRoutes.listOfPackages, {}, function (data) {
                    userPackages = data.items;
                });
            };

            function getUserPackages() {
                return userPackages;
            }

            return {
                reloadUserPackages: reloadUserPackages,
                getUserPackages: getUserPackages
            };
        }])
    }
)();
