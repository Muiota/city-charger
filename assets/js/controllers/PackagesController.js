/*jslint browser: true*/
/*global angular, CC */
(function () {
    'use strict';
    CC.app.controller("PackagesController", ["$scope", "RestService", "PackagesService",
        function ($scope, restService, packagesService) {

            $scope.i8n = CC.i8n;
            $scope.packagesService = packagesService;

            $scope.reload = function () {
                packagesService.reloadUserPackages();
            };

            $scope.getIcon = function (item) {
                switch (item.type) {
                    case CC.WasteTypeEnum.glass:
                        return "svg-light";
                    case CC.WasteTypeEnum.plastic:
                        return "svg-plastic";
                    case CC.WasteTypeEnum.battery:
                        return "svg-battery";
                    default:
                        return "svg-battery";
                }
            }

            $scope.getName = CC.getWasteName;

            $scope.getVolume = function (item) {
                switch (item.type) {
                    case CC.WasteTypeEnum.glass:
                        return item.total + " Volts";
                    case CC.WasteTypeEnum.plastic:
                        return item.total + " Liters";
                    case CC.WasteTypeEnum.battery:
                        return item.total + " Volts";
                    default:
                        return "battery";
                }
            };

            $scope.getDescription = function (item) {
                let total = 0;
                for (let i in item.items) {
                    if (!item.items.hasOwnProperty(i)) {
                        continue;
                    }
                    let el = item.items[i];
                    total += el.count;
                }
                return total + (total <= 1 ? " item" : " items");
            };

            $scope.getStatus = function (item) {
                switch (item.status) {
                    case CC.PackageItemStatus.wait:
                        return "Searching courier";
                    case  CC.PackageItemStatus.delivery:
                        return "Delivering";
                    case  CC.PackageItemStatus.recycled:
                        return "Complete";
                }
            };


        }])
})();