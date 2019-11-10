/*jslint browser: true*/
/*global angular, CC */
(function () {
    'use strict';
    CC.app.controller("CourierController", ["$scope", "RestService", "PackagesService", '$interval',
        function ($scope, restService, packagesService, $interval) {

            $scope.i8n = CC.i8n;
            $scope.packagesService = packagesService;

            let db = {
                "staticAcceptPoints": [
                    {
                        "address": "г.Санкт-Петербург, Рижский проспект, дом 10",
                        "name": "Точка приема 1",
                        "description": 'График работы: с 09:00 до 18:00'
                    },
                    {
                        "address": "г.Санкт-Петербург, Промышленная улица, дом 10",
                        "name": "Точка приема 2",
                        "description": "Точка приема 2. График работы: с 10:00 до 16:00"
                    },
                    {
                        "address": "г.Санкт-Петербург, Салова улица, дом 10",
                        "name": "Точка приема 3",
                        "description": "Точка приема 3. График работы: с 08:00 до 16:00"
                    }
                ],
                "mobileAcceptPoints": [
                    {
                        "status": "Идет прием мусора до 20:00",
                        "lat": 59.86,
                        "lng": 30.26
                    },
                    {
                        "status": "Движется к месту приема мусора",
                        "lat": 55.77,
                        "lng": 37.61
                    },
                    {
                        "status": "Заполнена",
                        "lat": 55.75,
                        "lng": 37.61
                    }
                ],
                "carriers": [
                    {
                        "name": "Скороход Иванович",
                        "lat": 59.87,
                        "lng": 30.303,
                        "description": "выносливый, быстрый и точный",
                        "phone": "+7(931)1234567"
                    },
                    {
                        "name": "Федор Усталый",
                        "lat": 59.897808,
                        "lng": 30.405951,
                        "description": "медленный",
                        "phone": "+7(931)72234562"

                    }
                ],
                "people": [
                    {
                        "address": "г.Санкт-Петербург, Славы проспект, дом 10",
                        "goods": "аккумулятор автомобильный, 5кг",
                        "phone": "+7(931)4236567"
                    },
                    {
                        "address": "г.Санкт-Петербург, Ленинский проспект, дом 10",
                        "goods": "макулатура, 10кг",
                        "phone": "+7(931)1534867"
                    },
                    {
                        "address": "г.Санкт-Петербург, Невский проспект, дом 10",
                        "goods": "батарея ноутбука, 1шт, 2кг",
                        "phone": "+7(931)9234567"
                    },
                    {
                        "address": "г.Санкт-Петербург, Невский проспект, дом 19",
                        "goods": "батарейки пальчиковые, 20шт",
                        "phone": "+7(931)9234567"
                    },
                    {
                        "address": "г.Санкт-Петербург, Большевиков проспект, дом 10",
                        "goods": "батарейки пальчиковые, 10шт",
                        "phone": "+7(931)9234567"
                    }
                ]
            };
            let myMap;

            function globalInit() {
                function init() {
                    myMap = new ymaps.Map('map', {
                        //center: [55.76, 37.64],
                        center: [59.9, 30.3],
                        zoom: 12,
                        controls: ["zoomControl"]
                    });
                }

                ymaps.ready(init);
            }


            function showPointByAddress(pointName, pointText, pointAddress, pointColor, pointStylePreset, pointContent) {
                var geocoder = ymaps.geocode(pointAddress, {results: 1, boundedBy: myMap.getBounds()});
                geocoder.then(function (res) {

                    let myGeoObject = res.geoObjects.get(0);

                    myMap.geoObjects.add(new ymaps.Placemark([myGeoObject.geometry._coordinates[0], myGeoObject.geometry._coordinates[1]], {
                        balloonContent: pointText,
                        iconCaption: pointName,
                        iconContent: pointContent
                    }, {
                        preset: pointStylePreset,
                        iconColor: pointColor
                    }));

                });
            }

            function showPointByCoords(pointName, pointText, pointLat, pointLng, pointColor, pointStylePreset) {

                myMap.geoObjects.add(new ymaps.Placemark([pointLat, pointLng], {
                    balloonContent: pointText,
                    iconCaption: pointName
                }, {
                    preset: pointStylePreset,
                    iconColor: pointColor
                }));

            }

            function showStaticAcceptPoints(pointData) {

                let staticAcceptPoints = pointData.staticAcceptPoints;
                for (let item in staticAcceptPoints) {
                    showPointByAddress(/*staticAcceptPoints[item].name*/"", staticAcceptPoints[item].description, staticAcceptPoints[item].address, "#00c400", "islands#blueWasteIcon");
                }

            }

            function showMobileAcceptPoints(pointData) {

                let mobileAcceptPoints = pointData.mobileAcceptPoints;
                for (let item in mobileAcceptPoints) {
                    showPointByCoords("", mobileAcceptPoints[item].status, mobileAcceptPoints[item].lat, mobileAcceptPoints[item].lng, "#00c400", "islands#blueDeliveryCircleIcon");
                }

            }

            function showCarriers(pointData) {
                let carriers = pointData.carriers;
                for (let item in carriers) {
                    showPointByCoords("", carriers[item].name + ". " + carriers[item].description, carriers[item].lat, carriers[item].lng, "#808080", "islands#blueRunCircleIcon");
                }
            }

            function showPeople(pointData) {
                let people = pointData.people;
                for (let item in people) {
                    showPointByAddress("", people[item].address + '.\r\n' + people[item].phone + '.\r\n' + people[item].goods, people[item].address, "#5828d1", "islands#bluePersonCircleIcon");
                }
            }


            function getMapForPeople(pointData) {
                showStaticAcceptPoints(pointData);
                showMobileAcceptPoints(pointData);
                showCarriers(pointData);
            }

            function getMapForCarrier(pointData) {
                showStaticAcceptPoints(pointData);
                showPeople(pointData);
            }

            function getMapForAcceptPoint(pointData) {
                showCarriers(pointData);
                showMobileAcceptPoints(pointData);
            }

            function showA() {

                // set here one of the available roles "people", "carrier" or "accept point"
                //let role = "people";
                let role = "carrier";
                //let role = "accept point";

                if (role === "people") {
                    getMapForPeople(db);
                } else if (role === "carrier") {
                    getMapForCarrier(db);
                } else if (role === "accept point") {
                    getMapForAcceptPoint(db);
                }

            }

            globalInit();
            $scope.mapInit = function () {
                showA();
            };

            $interval(function () {
                packagesService.reloadWaitingPackages();
            }, 3000);

            $scope.takeIt = function (item) {
                packagesService.takePackage({packageId: item.id});
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
            };

            $scope.getName = function (item) {
                switch (item.type) {
                    case CC.WasteTypeEnum.glass:
                        return "glass";
                    case CC.WasteTypeEnum.paper:
                        return "paper";
                    case CC.WasteTypeEnum.battery:
                        return "battery";
                    default:
                        return "battery";
                }
            };

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
                        return "Waiting for take";
                    case  CC.PackageItemStatus.delivery:
                        return "Delivering";
                    case  CC.PackageItemStatus.recycled:
                        return "Complete";
                }
            };


        }])
})();