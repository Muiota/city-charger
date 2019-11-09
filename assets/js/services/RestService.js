/*jslint browser: true*/
/*global angular, CC */
(function () {
        'use strict';
        CC.app.service('RestService', ["$resource", "$cookies", function ($resource, $cookies) {

            function transformResponse(data) {
                var response;
                try {
                    response = angular.fromJson(data);
                } catch (e) {
                    loggerService.error(e, QD.debugSettings.isCommonLogging);
                    response = {
                        error: QD.notifications.Global.clientSideUnknownError
                    };
                }
                return response;
            }

            function getWrappedCallback(url, callback, isError) {
                return function (a, b, c, d) {


                    if (a.cookie) {
                        $cookies.put("CITY_CHARGER_AUTH", a.cookie, []);
                    }

                    if (a.redirect) {
                        setTimeout(function () {
                            window.location.href = a.redirect;
                        }, 1000);
                    }

                    if (isError || a.error) {
                        console.error("error response statusCode=" + c + " url=" + url + " response: " + a + "headers: " + headers,
                            true);
                    } else {
                        console.info("success url=" + url + " response:", a);
                    }
                    if (!angular.isUndefined(callback) && angular.isFunction(callback)) {
                        callback(a, b, c, d);
                    }
                };
            }

            function post(url, req, successCallback, errorCallback) {
                var resource = $resource(url, {}, {
                    execute: {
                        method: "POST",
                        isArray: false,
                        headers: {
                            accept: "application/json;charset=utf-8"
                        },
                        transformResponse: transformResponse,
                        responseType: "json"
                    }
                });
                resource.execute(req,
                    getWrappedCallback(url, successCallback),
                    getWrappedCallback(url, errorCallback, true));

                /*   return $http({
                       method: 'POST',
                       data: req,
                       url: url
                   }).then(successCallback, errorCallback);*/
            }

            return {
                post: post
            };
        }])
    }
)();
