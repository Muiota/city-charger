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
                signIn: "/account/signin",
                signUp: "/account/signup"
            },
            ApiRoutes: {
                signIn: "/api/v1/signIn",
                signUp: "/api/v1/signUp",
                logout: "/api/v1/logout",
                createPackage: "/api/v1/createPackage",
                listOfPackages: "/api/v1/listOfPackages",
                getAllPackages: "/api/v1/getAllPackages",
                assignPackage: "/api/v1/assignPackage",
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
            var isLogged = false;
            if (!cookie) {
                console.log("unlogged " + req.originalUrl + " no cookie");
            } else {
                cookie.split(';').forEach(function (cookie) {
                    let parts = cookie.trim().split('=');
                    let key = parts.shift().trim();
                    let value = decodeURI(parts.join('=').trim());
                    if (value && key === dictionary.Cookies.cityChargerAuth) {
                        let auth = Buffer.from(value.split("%")[0], 'base64').toString();
                        let authObj = JSON.parse(auth); //todo guiard
                        if (authObj.userid) {
                            let session = data.sessions[authObj.userid];
                            if (session && authObj.token === session.token) {
                                console.log("logged " + req.originalUrl);
                                isLogged = true;
                            }
                        }
                    }
                });
            }
            if (isLogged) {
                return true;
            }
            console.log("unlogged " + req.originalUrl + " " + cookie + " " + JSON.stringify(data.sessions));
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
            console.log(JSON.stringify(data.users) + " username=" + username + " password=" + password);
            for (var i in data.users) {
                if (!data.users.hasOwnProperty(i)) {
                    continue;
                }
                var user = data.users[i];
                if (user.username === username &&
                    user.password === password) {
                    var token = uuidv1();
                    let value = {userid: user.id, token: token, username: user.username};
                    let auth = Buffer.from(JSON.stringify(value)).toString('base64');
                    console.log("Set cookie " + auth);
                    res.cookie(dictionary.Cookies.cityChargerAuth, auth, {maxAge: 900000});
                    data.sessions[user.id] = {
                        expiry: Date.now() + 86400 * 1000,
                        token: token
                    };
                    return {
                        isSuccess: true,
                        cookie: auth,
                        redirect: dictionary.StaticRoutes.account
                    };
                }
            }

            return {error: "userNotFound"};
        }

        function signUp(request, res) {
            var username = request.username;
            var password = request.password;
            console.log(JSON.stringify(data.users) + " username=" + username + " password=" + password);
            for (var i in data.users) {
                if (!data.users.hasOwnProperty(i)) {
                    continue;
                }
                var user = data.users[i];
                if (user.username === username) {
                    return {error: "userAlreadyExist"};
                }
            }
            data.createUser(request.username, request.password);
            console.log("User " + request.username + " created");
            return login(request, res);
        }

        function logout(request, res) {
            console.log("Logout " + request.userid);
            data.sessions[request.userid] = {};
            res.cookie(dictionary.Cookies.cityChargerAuth, "", {maxAge: 900000});
            return {
                isSuccess: true
            };
        }


        function handleApi(req, res) {
            let requestBody = req.body;
            let responseBody;
            let originalUrl = req.originalUrl.split("?")[0];
            switch (originalUrl) {
                case dictionary.ApiRoutes.signIn:
                    responseBody = login(requestBody, res);
                    break;
                case dictionary.ApiRoutes.signUp:
                    responseBody = signUp(requestBody, res);
                    break;
                case dictionary.ApiRoutes.logout:
                    responseBody = logout(requestBody, res);
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

            let originalUrl = req.originalUrl.split("?")[0];
            try {


                //Unauthorized requests
                switch (originalUrl) {
                    case dictionary.StaticRoutes.landing:
                        return handleStatic(res, "index.html");
                    case dictionary.StaticRoutes.signIn:
                        return handleStatic(res, "client/signin/index.html");
                    case dictionary.StaticRoutes.signUp:
                        return handleStatic(res, "client/signup/index.html");
                    case dictionary.ApiRoutes.signIn:
                    case dictionary.ApiRoutes.signUp:
                    case dictionary.ApiRoutes.logout:
                        return handleApi(req, res);
                }

                if (oAuthGuard(req, res)) {
                    switch (originalUrl) {
                        case dictionary.StaticRoutes.account:
                            handleStatic(res, "client/index.html");
                            break;
                        default:
                            handleApi(req, res);
                            break;
                    }
                }

            } catch (e) {
                console.error(originalUrl, e);
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