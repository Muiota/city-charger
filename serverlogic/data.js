/*jslint browser: true*/
/*global angular */
/*This is backend prototype for City charger project for Baltic Sea Hack*/

(function () {
    'use strict';

    exports.generatePK = function () {
        return Date.now();
    }


    exports.users = [];
    exports.sessions = [];
    exports.createUser = function (username, password) {
        exports.users.push({

            id: exports.generatePK(),
            username: username,
            password: password,
        });
    };
    exports.createUser("Muiota", "test");

}());