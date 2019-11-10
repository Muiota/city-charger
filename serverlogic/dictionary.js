/*jslint browser: true*/
/*global angular */
/*This is backend prototype for City charger project for Baltic Sea Hack*/

(function () {
    'use strict';

    exports.dictionary = {
        StaticRoutes: {
            landing: "/",
            account: "/account",
            signIn: "/account/signin",
            signUp: "/account/signup"
        },
        ApiRoutes: {
            signIn: "/api/v1/signIn",
            signUp: "/api/v1/signUp",
            logout: "/api/v1/logout",
            createPackage: "/api/v1/createPackage",
            listOfPackages: "/api/v1/listOfPackages",
            getAllPackages: "/api/v1/getAllPackages",
            assignPackage: "/api/v1/assignPackage",
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
        Cookies: {
            cityChargerAuth: "CITY_CHARGER_AUTH"
        },
        UserTypeEnum: {
            citizen: "citizen",
            courier: "courier",
            recycler: "recycler"
        },
        WasteTypeEnum: {
            battery: "battery",
            paper: "paper",
            plastic: "plastic",
            glass: "glass"
        }
    };


}());