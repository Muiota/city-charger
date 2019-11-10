/*jslint browser: true*/
/*global angular, CC */
(function () {
        'use strict';
        CC.app.service('PackagesService', ['RestService', '$mdToast', function (restService, $mdToast) {

            let userPackages = [];
            let waitingPackages = [];

            function reloadUserPackages() {
                restService.post(CC.ApiRoutes.listOfPackages, {}, function (data) {
                    userPackages = data.items;
                });
            }

            function reloadWaitingPackages() {
                restService.post(CC.ApiRoutes.getWaitingPackages, {}, function (data) {
                    waitingPackages = data.items;
                });
            }

            function getUserPackages() {
                return userPackages;
            }

            function getWaitingPackages() {
                return waitingPackages;
            }

            function createPackage(request) {
                restService.post(CC.ApiRoutes.createPackage, request, function (data) {
                    reloadUserPackages();
                    $mdToast.show({
                        template: '<md-toast class="md-toast ' + '">' + CC.i8n('packageCreated') + '</md-toast>',
                        hideDelay: 12000,
                        position: 'top right'
                    });
                })
            }

            return {
                createPackage: createPackage,
                reloadUserPackages: reloadUserPackages,
                reloadWaitingPackages: reloadWaitingPackages,
                getUserPackages: getUserPackages,
                getWaitingPackages: getWaitingPackages
            };
        }])
    }
)();
