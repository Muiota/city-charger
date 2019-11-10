/*jslint browser: true*/
/*global angular */
/*This is backend prototype for City charger project for Baltic Sea Hack*/

(function () {
    'use strict';

    const data = require("./data.js");

    exports.createPackage = function (request, res) {
        var total = 0;
        for (var i in request.items) {
            if (!request.items.hasOwnProperty(i)) {
                continue;
            }
            let item = request.items[i];
            if (item.count > 0) {
                total = total + item.count * item.ratio;
            }
        }

        data.createPackage(request.userid, request.items, request.type, request.total);
        return {
            isSuccess: true,
            message: "packageCreatedSuccess"
        };
    };

    exports.listOfPackages = function (request, res) {
        let items = data.packages.filter(function (f) {
            return f.userid === request.userid;
        });
        return {
            items: items
        };
    };

}());