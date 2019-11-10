/*jslint browser: true*/
/*global angular */
/*This is backend prototype for City charger project for Baltic Sea Hack*/

(function () {
    'use strict';
    const dict = require("./dictionary.js");
    const dictionary = dict.dictionary;
    exports.generatePK = function () {
        return Date.now();
    };


    exports.users = [];
    exports.sessions = [];
    exports.packages = [];

    exports.createUser = function (username, password) {
        exports.users.push({
            id: exports.generatePK(),
            username: username,
            password: password,
        });
    };

    exports.createPackage = function (userid, items) {
        let pack = {
            id: exports.generatePK(),
            userid: userid,
            items: items,
            createDate: Date.now(),
            status: dictionary.PackageItemStatus.wait
        };
        exports.packages.push(pack);
        console.log("Package " + JSON.stringify(pack) + " created");
    };

    exports.createUser("Muiota", "test");

}());