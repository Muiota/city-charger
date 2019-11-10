/*jslint browser: true*/
/*global angular */
/*This is backend prototype for City charger project for Baltic Sea Hack*/

(function () {
    'use strict';

    const dict = require("./dictionary.js");
    const dictionary = dict.dictionary;
    const data = require("./data.js");
    const uuidv1 = require('uuid/v1');

    exports.oAuthGuard = function (req, res) {
        let cookie = req.headers.cookie;
        let isLogged = false;
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
    };


    exports.login = function (request, res) {
        let username = request.username;
        let password = request.password;

        if (!username || !password || username.length < 4 || password.length < 4) {
            return {error: "invalidCredentials"};
        }

        console.log(JSON.stringify(data.users) + " username=" + username + " password=" + password);
        for (let i in data.users) {
            if (!data.users.hasOwnProperty(i)) {
                continue;
            }
            let user = data.users[i];
            if (user.username === username &&
                user.password === password) {
                let token = uuidv1();
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
    };

    exports.signUp = function (request, res) {
        var username = request.username;
        var password = request.password;

        if (!username || !password || username.length < 4 || password.length < 4) {
            return {error: "invalidCredentials"};
        }
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
        return exports.login(request, res);
    };

    exports.logout = function (request, res) {
        console.log("Logout " + request.userid);
        data.sessions[request.userid] = {};
        res.cookie(dictionary.Cookies.cityChargerAuth, "", {maxAge: 900000});
        return {
            isSuccess: true
        };
    };

}());