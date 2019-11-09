/*jslint browser: true*/
/*global */
/*This is backend prototype for City charger project for Baltic Sea Hack*/

(function () {
        'use strict';
        let fs = require('fs');
        const uuidv1 = require('uuid/v1');
        const data = require("./data.js");
        let dictionary = {
            StaticRoutes: {
                landing: "/",
                account: "/account",
                signIn: "/account/signIn",
                signUp: "/account/signUp"
            },
            ApiRoutes: {
                signIn: "/api/v1/signIn",
                signUp: "/api/v1/signUp",
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


        function oAuthGuard(req, res) {
            let cookie = req.headers.cookie;
            if (!cookie) {
                console.log("unlogged " + req.originalUrl + " no cookie");
                return false;
            }
            let sessions = data.getSessions();
            var isLogged = false;
            cookie.split(';').forEach(function (cookie) {
                let parts = cookie.trim().split('=');
                let key = parts.shift().trim();
                let value = decodeURI(parts.join('=').trim());
                if (value && key === dictionary.Cookies.cityChargerAuth) {
                    console.log(value);
                    let auth = Buffer.from(value.split("%")[0], 'base64').toString();
                    console.log(auth);
                    let authObj = JSON.parse(auth); //todo guiard
                    if (authObj.userid) {
                        let session = sessions[authObj.userid];
                        if (session && authObj.token === session.token) {
                            console.log("logged " + req.originalUrl);
                            isLogged = true;
                        }
                    }
                }
            });

            if (isLogged) {
                return true;
            }
            console.log("unlogged " + req.originalUrl + " " + cookie + " " + JSON.stringify(sessions));
            res.writeHead(301, {Location: dictionary.StaticRoutes.signIn});
            res.end();
            return false;
        }

        function handleStatic(res, template) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(fs.readFileSync(__dirname + '/../' + template).toString());
        }

        function sendResponse(res, requestBody, responseBody) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.send(responseBody);
            console.log(JSON.stringify(requestBody) + "->" + JSON.stringify(responseBody));
        }


        function login(request, res) {
            var username = request.username;
            var password = request.password;
            let users = data.getUsers();
            console.log(JSON.stringify(users) + " username=" + username + " password=" + password);
            for (var i in users) {
                if (!users.hasOwnProperty(i)) {
                    continue;
                }
                var user = users[i];
                if (user.username === username &&
                    user.password === password) {
                    var token = uuidv1();
                    let value = {userid: user.id, token: token};
                    let auth = Buffer.from(JSON.stringify(value)).toString('base64');
                    console.log("Set cookie " + auth);
                    res.cookie(dictionary.Cookies.cityChargerAuth, auth, {maxAge: 900000});
                    let sessions = data.getSessions();
                    sessions[user.id] = {
                        expiry: Date.now() + 86400 * 1000,
                        token: token
                    };
                    data.setSessions(sessions);
                    return {
                        isSuccess: true,
                        cookie: auth,
                        redirect: dictionary.StaticRoutes.account
                    };
                }
            }

            return {error: "userNotFound"};
        }


        function handleApi(req, res) {
            let requestBody = req.body;
            let responseBody;
            switch (req.originalUrl) {
                case dictionary.ApiRoutes.signIn:
                    responseBody = login(requestBody, res);
                    break;
                case dictionary.ApiRoutes.signUp:
                    // handleApi(req, res);
                    break;
            }
            sendResponse(res, requestBody, responseBody);
        }

        //Exports

        exports.dictionary = dictionary;

        exports.signin = function (request) {
            return "City charger 0.0.1";
        };

        exports.handleRequest = function (req, res) {

            try {


                //Unauthorized requests
                switch (req.originalUrl) {
                    case dictionary.StaticRoutes.landing:
                        return handleStatic(res, "index.html");
                    case dictionary.StaticRoutes.signIn:
                        return handleStatic(res, "client/signIn/index.html");
                    case dictionary.StaticRoutes.signUp:
                        return handleStatic(res, "client/signUp/index.html");
                    case dictionary.ApiRoutes.signIn:
                    case dictionary.ApiRoutes.signUp:
                        return handleApi(req, res);
                }

                if (oAuthGuard(req, res)) {
                    switch (req.originalUrl) {
                        case dictionary.StaticRoutes.account:
                            handleStatic(res, "client/index.html");
                            break;
                        default:
                            handleApi(req, res);
                            break;
                    }
                }

            } catch (e) {
                console.error(req.originalUrl, e);
                res.statusCode = 501;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.send({error: "unhandledError"});
            }
        };

        exports.version = function () {
            return "City charger 0.0.1";
        };

    }()
);