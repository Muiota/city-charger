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
        let user = {
            id: exports.generatePK(),
            username: username,
            password: password,
        };
        exports.users.push(user);
        return user;
    };

    exports.createPackage = function (userid, items, type, total) {
        let pack = {
            id: exports.generatePK(),
            userid: userid,
            type: type,
            total: total,
            items: items,
            createDate: Date.now(),
            courierId: 0,
            status: dictionary.PackageItemStatus.wait
        };

        var userItems = exports.users.filter(function (u) {
            u.id = userid;
        });
        if (userItems.length) {
            let initiator = userItems[0].username;
            console.log("Assign initiator");
            pack.initiator = initiator;
        }
        exports.packages.push(pack);
        console.log("Package " + JSON.stringify(pack) + " created");
    };

    let user = exports.createUser("Muiota", "test");
    exports.createPackage(user.id, [{
        type: dictionary.PackageItemTypes.B6F22,
        count: 2,
        ratio: 220,
    }], dictionary.WasteTypeEnum.glass, 440);
}());