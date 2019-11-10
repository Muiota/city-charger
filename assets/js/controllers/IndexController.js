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


            $scope.getBadgeCount = function () {
                return "1";
            }

            function DialogController($scope, $mdDialog) {
                $scope.i8n = CC.i8n;

                $scope.items = [{
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
                    }];


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
                    let request = {items: [], type: CC.WasteTypeEnum.battery, total: $scope.total};
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
                    .then(function (request) {
                        packagesService.createPackage(request);
                    }, function () {
                        $scope.status = 'You cancelled the dialog.';
                    });
            };

            packagesService.reloadUserPackages();

        }])
})();