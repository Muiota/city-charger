/*jslint browser: true*/
/*global angular */
/*This is backend prototype for City charger project for Baltic Sea Hack*/

(function () {
    'use strict';

    const data = require("./data.js");
    const dict = require("./dictionary.js");
    const dictionary = dict.dictionary;

    exports.createPackage = function (request, res) {
        let total = 0;
        for (let i in request.items) {
            if (!request.items.hasOwnProperty(i)) {
                continue;
            }
            let item = request.items[i];
            if (item.count > 0) {
                total = total + item.count * item.ratio;
            }
        }

        data.createPackage(request.userid, request.items, request.type, total);
        return {
            isSuccess: true,
            message: "packageCreatedSuccess"
        };
    };

    exports.listOfPackages = function (request, res) {
        let items = data.packages.filter(function (f) {
            return f.userid === request.userid;
        }).sort(function (a, b) {
            return b.createDate - a.createDate
        });
        return {
            items: items
        };
    };

    exports.listOfPackagesWaiting = function (request, res) {
        let items = data.packages.filter(function (f) {
            return (f.userid !== request.userid && f.status === dictionary.PackageItemStatus.wait) ||
                (f.courierId === request.userid);
        }).sort(function (a, b) {
            return b.createDate - a.createDate
        });
        return {
            items: items
        };
    };

    exports.takePackage = function (request, res) {
        let items = data.packages.filter(function (f) {
            return (f.userid !== request.userid && f.status === dictionary.PackageItemStatus.wait &&
            f.id === request.packageId);
        });

        for (let i in items)
        {
            if (!items.hasOwnProperty(i)) {
                continue;
            }
            let item = items[i];

            item.status = dictionary.PackageItemStatus.delivery;
            item.courierId = request.userid;
        }

        return {
            isSuccess: true,
            message: "packageInDelivered"
        };
    };

}());