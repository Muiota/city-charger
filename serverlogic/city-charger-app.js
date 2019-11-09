/*jslint browser: true*/
/*global angular */
/*This is backend prototype for City charger project for Baltic Sea Hack*/

(function () {
        'use strict';
        let fs = require('fs');
        let dictionary = {
            Routes: {
                landing: "/",
                account: "/account",
                signin: "/account/signin",
                signup: "/account/signup"
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

        function generatePK() {
            return Date.now();
        }

        var dbSessions = [];

        var dbUserList = [{
            id: generatePK(),
            login: "Muiota",
            pass: "test",
        }];


        function oAuthGuard(req, res) {
            let cookie = req.headers.cookie;

            if (!cookie) {
                return false;
            }

            cookie.split(';').forEach(function (cookie) {
                let parts = cookie.split('=');
                let key = parts.shift().trim();
                let value = decodeURI(parts.join('='));
                if (value && key === dictionary.Cookies.cityChargerAuth) {
                    let auth = value.btoa(value);
                    let authObj = JSON.parse(auth); //todo guiard
                    if (authObj.userId) {
                        let session = dbSessions[uthObj.userId];
                        if (session && session.expiry > Date.now() && authObj.token === session.token) {
                            console.log("logged");
                            return true;
                        }
                    }
                }
            });
            res.writeHead(301, {Location: dictionary.Routes.signin});
            res.end();
            return false;
        }

        function handleStatic(res, template, withAuthorization) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(fs.readFileSync(__dirname + '/../' + template).toString());
        }


        //Exports

        exports.dictionary = dictionary;

        exports.signin = function (request) {
            return "City charger 0.0.1";
        };

        exports.handleRequest = function (req, res) {

            switch (req.originalUrl) {
                case dictionary.Routes.landing:
                    return handleStatic(res, "index.html");
                case dictionary.Routes.signin:
                    return handleStatic(res, "client/signin/index.html");
                case dictionary.Routes.signup:
                    return handleStatic(res, "client/signup/index.html");
            }

            if (oAuthGuard(req, res)) {
                switch (req.originalUrl) {
                    case dictionary.Routes.account:
                        handleStatic(res, "client/index.html");
                        break;
                }
            }
        };

        exports.version = function () {
            return "City charger 0.0.1";
        };

        exports.logout = function () {
            console.log("Logout");
        };


    }

    ()
);