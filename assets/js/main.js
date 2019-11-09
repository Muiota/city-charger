/*jslint browser: true*/
/*global angular */
var CC = (function () {
    "use strict";

    return {
        ApiRoutes: {
            signIn: "/api/v1/signIn",
            signUp: "/api/v1/signUp",
        },
        app: angular.module("CC", ["ngMaterial", "ngMessages", "ngAnimate", "ngResource", "ngCookies"])
            .config(function ($mdIconProvider, $mdThemingProvider, $sceProvider) {
                $sceProvider.enabled(false);
                $mdIconProvider
                    .defaultIconSet('/images/avatars.svg', 128)
                    .icon('menu', '/images/menu.svg', 24)
                    .icon("share", "/images/share.svg", 24)
                    .icon("google_plus", "/images/google_plus.svg", 512)
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