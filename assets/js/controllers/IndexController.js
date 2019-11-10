/*jslint browser: true*/
/*global angular, CC */
(function () {
    'use strict';
    CC.app.controller("IndexController", ["$scope", 'UsersService', "$mdSidenav", "RestService",
        "$cookies", "$mdDialog", "PackagesService",
        function ($scope, usersService, $mdSidenav, restService, $cookies, $mdDialog, packagesService) {
            $scope.usersService = usersService;
            $scope.i8n = CC.i8n;
            $scope.currentTab = CC.tabs.citizen;
            $scope.tabs = CC.tabs;
            $scope.changeTab = function (tab) {
                $scope.currentTab = tab;
                switch (tab) {
                    case CC.tabs.citizen:
                        packagesService.reloadUserPackages();
                        break;
                    case CC.tabs.courier:
                        packagesService.reloadWaitingPackages();
                        break;
                    case CC.tabs.recycler:
                        break;
                }

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


            $scope.getBadgeCount = function (tab) {
                switch (tab) {
                    case CC.tabs.citizen:
                        const items = packagesService.getUserPackages().filter(function (f) {
                            return f.status === CC.PackageItemStatus.wait;
                        });
                        return items.length;
                    case CC.tabs.courier:
                        const itemsWait = packagesService.getWaitingPackages().filter(function (f) {
                            return f.status === CC.PackageItemStatus.wait;
                        });
                        return itemsWait.length;
                    case CC.tabs.recycler:
                        return 0;
                }
                return 0;
            }

            function DialogController($scope, $mdDialog, initType, initSubtypes) {
                $scope.i8n = CC.i8n;
                $scope.initType = initType;
                $scope.initSubtypes = initSubtypes;
                $scope.items = initSubtypes;

                $scope.hide = function () {
                    $mdDialog.hide();
                };
                $scope.total = 0;
                $scope.recalcTotal = function () {
                    $scope.total = 0;
                    for (var i in $scope.items) {
                        if (!$scope.items.hasOwnProperty(i)) {
                            continue;
                        }
                        let item = $scope.items[i];
                        if (item.count > 0) {
                            $scope.total = $scope.total + item.count * item.ratio;
                        }
                    }
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.requestPackage = function (answer) {
                    let request = {items: [], type:  $scope.initType, total: $scope.total};
                    for (let i in $scope.items) {
                        if (!$scope.items.hasOwnProperty(i)) {
                            continue;
                        }
                        let item = $scope.items[i];
                        if (item.count) {
                            request.items.push({
                                type: item.type,
                                count: item.count,
                                ratio: item.ratio,
                            });
                        }
                    }
                    $mdDialog.hide(request);
                };

                $scope.decrementQnt = function (item) {
                    if (item.count > 0) {
                        item.count--;
                        $scope.recalcTotal();
                    }
                };

                $scope.incrementQnt = function (item) {
                    if (item.count < 100) {
                        item.count++;
                        $scope.recalcTotal();
                    }
                };
                $scope.recalcTotal();
                $scope.getMeasure = CC.getMeasure;
            }

            $scope.showCreateBatteryPackageDialog = function (ev) {
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: "/templates/createPackage.template.html",
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        initType: CC.WasteTypeEnum.battery,
                        initSubtypes: [{
                                title: "AA battery 1.5V",
                                type: CC.PackageItemTypes.BAA,
                                ratio: 1.5,
                                icon: "svg-battery",
                                count: 0
                            },
                            {
                                title: "6F22 battery 9V",
                                ratio: 9,
                                type: CC.PackageItemTypes.B6F22,
                                icon: "svg-battery",
                                count: 0
                            },
                            {
                                title: "23AA battery 12V",
                                ratio: 12,
                                type: CC.PackageItemTypes.B6F22,
                                icon: "svg-battery",
                                count: 0
                            }]
                    },
                    clickOutsideToClose: true,
                    fullscreen: false // Only for -xs, -sm breakpoints.
                })
                    .then(function (request) {
                        packagesService.createPackage(request);
                    }, function () {
                        $scope.status = 'You cancelled the dialog.';
                    });
            };

            $scope.showCreatePlasticPackageDialog = function (ev) {
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: "/templates/createPackage.template.html",
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        initType: CC.WasteTypeEnum.plastic,
                        initSubtypes: [{
                            title: "Plastic bottle 1L",
                            type: CC.PackageItemTypes.BAA,
                            ratio: 1,
                            icon: "svg-shampoo",
                            count: 0
                        },
                            {
                                title: "Water bottle 1.5L",
                                ratio: 1.5,
                                type: CC.PackageItemTypes.B6F22,
                                icon: "svg-plastic-standart",
                                count: 0
                            },
                            {
                                title: "Plastic bottle 5L",
                                ratio: 5,
                                type: CC.PackageItemTypes.B6F22,
                                icon: "svg-plastic",
                                count: 0
                            }]
                    },
                    clickOutsideToClose: true,
                    fullscreen: false // Only for -xs, -sm breakpoints.
                })
                    .then(function (request) {
                        packagesService.createPackage(request);
                    }, function () {
                        $scope.status = 'You cancelled the dialog.';
                    });
            };


            $scope.showCreateLampPackageDialog = function (ev) {
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: "/templates/createPackage.template.html",
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        initType: CC.WasteTypeEnum.glass,
                        initSubtypes: [{
                            title: "5V lamp",
                            type: CC.PackageItemTypes.BAA,
                            ratio: 5,
                            icon: "svg-light",
                            count: 0
                        },
                            {
                                title: "12V lamp",
                                ratio: 12,
                                type: CC.PackageItemTypes.B6F22,
                                icon: "svg-light",
                                count: 0
                            },
                            {
                                title: "220V lamp",
                                ratio: 220,
                                type: CC.PackageItemTypes.B6F22,
                                icon: "svg-light",
                                count: 0
                            }]
                    },
                    clickOutsideToClose: true,
                    fullscreen: false // Only for -xs, -sm breakpoints.
                })
                    .then(function (request) {
                        packagesService.createPackage(request);
                    }, function () {
                        $scope.status = 'You cancelled the dialog.';
                    });
            };

            packagesService.reloadUserPackages();

        }])
})();