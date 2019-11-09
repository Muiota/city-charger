/*jslint browser: true*/
/*global angular, CC */
(function () {
        'use strict';
        CC.app.service('RestService', ["$resource", "$cookies", "$mdToast", "UsersService", function ($resource, $cookies, $mdToast, usersService) {

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

                    if (a.redirect) {
                        setTimeout(function () {
                            window.location.href = a.redirect + "?nocache=" + (new Date()).getTime();
                        }, 100);
                    }

                    if (isError || a.error) {

                        if (a.error) {
                            $mdToast.show({
                                template: '<md-toast class="md-toast ' + "error" + '">' + CC.i8n(a.error) + '</md-toast>',
                                hideDelay: 12000,
                                position: 'top right'
                            });
                            /*  $mdToast.simple()
                                  .textContent(CC.i8n(a.error))
                                  .position("top right")
                                  .hideDelay(10000))
                              .then(function () {

                              }).catch(function () {

                          })*/
                            ;
                        }
                        console.error("error response statusCode=" + c + " url=" + url + " response: " + a,
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
                req = req || {};
                req.userid = usersService.getUserInfo().userid;
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
