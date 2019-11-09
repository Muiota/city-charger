/*jslint browser: true*/
/*global angular */
/*This is backend prototype for City charger project for Baltic Sea Hack*/

(function () {
    'use strict';

    const users = require('data-store')({path: './data/data.json'});


    exports.generatePK = function () {
        return Date.now();
    }

    exports.getUsers = function () {
        return users.get("users");
    };
    exports.setUsers = function (obj) {
        users.set("users", obj);
    };

    exports.getSessions = function () {
        let sessions = users.get("sessions");
        console.log("get sessions", sessions);
        return sessions;
    };
    exports.setSessions = function (obj) {
        users.set("sessions", obj);
        console.log("set sessions", obj);
    };

    exports.setUsers([{
        id: exports.generatePK(),
        username: "Muiota",
        password: "test",
    }]);
    exports.setSessions([]);
}());