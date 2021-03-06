﻿(function () {
    'use strict';

    angular.module('app.security')
        .factory('authenticationService', authenticationService);

    /* @ngInject */
    function authenticationService($resource, configService, oauthTokenService, $state) {
        var loginResource = function () {
            return $resource(configService.getTokenUrl(), {},
                {
                    save: {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Basic ' + configService.getOauthBasicKey(),
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function (data) {
                            var str = [];
                            for (var d in data) {
                                str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
                            }
                            return str.join("&");
                        }
                    }
                });
        };

        var service = {};
        service.login = login;
        service.logout = logout;

        return service;

        function login(loginInfo, success, error) {
            var requiredParameters = {
                grant_type: 'password',
                response_type: 'token'
            };
            var oauthParameters = angular.extend(requiredParameters, loginInfo);
            return loginResource().save(oauthParameters, success, error);
        }

        function logout() {
            oauthTokenService.removeToken();
            $state.go("fe.login");
        }
    }
})();