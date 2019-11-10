/*jslint browser: true*/
/*global angular */
var CC = (function () {
    "use strict";

    return {
        ApiRoutes: {
            signIn: "/api/v1/signIn",
            signUp: "/api/v1/signUp",
            logout: "/api/v1/logout",
            createPackage: "/api/v1/createPackage",
            listOfPackages: "/api/v1/listOfPackages",
            getWaitingPackages: "/api/v1/getWaitingPackages",
            takePackage: "/api/v1/takePackage",
        },
        PackageItemTypes: {
            "BAA": "AA",
            "B6F22": "6F22",
            "B23AA": "23AA",
        },
        PackageItemStatus: {
            wait: "wait",
            delivery: "delivery",
            recycled: "recycled",
        },
        WasteTypeEnum: {
            battery: "battery",
            paper: "paper",
            plastic: "plastic",
            glass: "glass"
        },
        tabs: {
            citizen: "citizen",
            courier: "courier",
            recycler: "recycler",
        },
        getMeasure: function (initType) {
            switch (initType) {
                case CC.WasteTypeEnum.plastic:
                    return 'Litres';
                case CC.WasteTypeEnum.battery:
                    return 'Volts';
                case CC.WasteTypeEnum.glass:
                    return 'Volts';
                case CC.WasteTypeEnum.paper:
                    return 'Kg';
            }
        },
        language: {
            current: "en",
            data: {
                "citizen": {
                    en: "Citizen",
                    ru: "горожанин",
                },
                "courier": {
                    en: "Courier",
                    ru: "Курьер",
                },
                "recycler": {
                    en: "Recycler",
                    ru: "Переработчик",
                },
                "battery": {
                    en: "Battery",
                    ru: "Батарейка",
                },
                "plastic": {
                    en: "Plastic",
                    ru: "Пластик",
                },
                "light": {
                    en: "Lamps",
                    ru: "Лампы",
                },
                "glass": {
                    en: "Lamps",
                    ru: "Лампы",
                },
                "create_package": {
                    en: "Create waste package",
                    ru: "Создать посылку",
                },
                "userNotFound": {
                    en: "User not found",
                    ru: "Пользователь не найден",
                },
                "userAlreadyExist": {
                    en: "User already exist",
                    ru: "Пользователь уже сучществует",
                },
                "logout": {
                    en: "Logout",
                    ru: "Выйти",
                },
                "packageCreatedSuccess": {
                    en: "Package created successfully",
                    ru: "Пачка создана успешно",
                },
                "invalidCredentials": {
                    en: "Invalid credentials",
                    ru: "Неправильная пара логин/пароль",
                },
                "packageCreated" : {
                    en: "Package created",
                    ru: "Пачка сделана",
                }
            }
        },
        i8n: function (msg) {
            var lang = CC.language.current || "en";
            let value = CC.language.data[msg];
            return value ? (value[lang] || msg) : msg;
        },
        app: angular.module("CC", ["ngMaterial", "ngMessages", "ngAnimate", "ngResource", "ngCookies"])
            .config(function ($mdIconProvider, $mdThemingProvider, $sceProvider) {
                $sceProvider.enabled(false);
                $mdIconProvider
                    .defaultIconSet('/images/avatars.svg', 128)
                    .icon('menu', '/images/menu.svg', 24)
                    .icon('settings', '/images/settings.svg', 24)
                    .icon("share", "/images/share.svg", 24)
                    .icon("google_plus", "/images/google_plus.svg", 512)
                    .icon("battery", "/images/battery.svg", 160)
                    .icon("hangouts", "/images/hangouts.svg", 512)
                    .icon("twitter", +"/images/twitter.svg", 512)
                    .icon("phone", "/images/phone.svg", 512);


                /*Available palettes: red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal, green,
                 light-green, lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey*/
                $mdThemingProvider.theme('default')
                    .primaryPalette('indigo')
                    .accentPalette('red');
            })
    };
}());