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
            }

            function getUserPackages() {
                return userPackages;
            }

            function createPackage(request) {
                restService.post(CC.ApiRoutes.createPackage, request, function (data) {
                    reloadUserPackages();
                })
            }

            return {
                createPackage: createPackage,
                reloadUserPackages: reloadUserPackages,
                getUserPackages: getUserPackages
            };
        }])
    }
)();
