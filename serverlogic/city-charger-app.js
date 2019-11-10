/*jslint browser: true*/
/*global */
/*This is backend prototype for City charger project for Baltic Sea Hack*/

(function () {
        'use strict';
        let fs = require('fs');

        const data = require("./data.js");
        const packageLogic = require("./package.js");
        const auth = require("./auth.js");
        const dict = require("./dictionary.js");
        let dictionary = dict.dictionary;

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

        function handleApi(req, res) {
            let requestBody = req.body;
            let responseBody;
            let originalUrl = req.originalUrl.split("?")[0];
            switch (originalUrl) {
                case dictionary.ApiRoutes.signIn:
                    responseBody = auth.login(requestBody, res);
                    break;
                case dictionary.ApiRoutes.signUp:
                    responseBody = auth.signUp(requestBody, res);
                    break;
                case dictionary.ApiRoutes.logout:
                    responseBody = auth.logout(requestBody, res);
                    break;
                case dictionary.ApiRoutes.createPackage:
                    responseBody = packageLogic.createPackage(requestBody, res);
                    break;
                case dictionary.ApiRoutes.listOfPackages:
                    responseBody = packageLogic.listOfPackages(requestBody, res);
                    break;
                case dictionary.ApiRoutes.getWaitingPackages:
                    responseBody = packageLogic.listOfPackagesWaiting(requestBody, res);
                    break;
                case dictionary.ApiRoutes.takePackage:
                    responseBody = packageLogic.takePackage(requestBody, res);
                    break;
            }
            sendResponse(res, requestBody, responseBody);
        }

        //Exports

        exports.dictionary = dictionary;

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

                if (auth.oAuthGuard(req, res)) {
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