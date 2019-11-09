/*jslint browser: true*/
/*global angular, CC */
(function () {
        'use strict';
        CC.app.service('UsersService', ['$cookies', function ($cookies) {

            var userData = $cookies.get("CITY_CHARGER_AUTH");
            var userInfo = {};
            if (userData) {
                userInfo = JSON.parse(atob(userData));
            }

            function getUserInfo() {
                return userInfo || {};
            }

            return {
                getUserInfo: getUserInfo
            };
        }])
    }
)();
