'use strict';

/*jshint sub:true*/

/**
 * @ngdoc service
 * @name WaterReporter.SecurityInterceptor
 * @description
 * # SecurityInterceptor
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .factory('SecurityInterceptor', function ($q, ipCookie, $location) {

    return {
      request: function(config) {

        var sessionCookie = ipCookie('WATERREPORTER_SESSION');

        //
        // Configure our headers to contain the appropriate tags
        //
        config.headers = config.headers || {};

        if (config.headers['Authorization-Bypass'] === true) {
          delete config.headers['Authorization-Bypass'];
          return config || $q.when(config);
        }

        if (sessionCookie) {
          config.headers.Authorization = 'Bearer ' + sessionCookie;
        }

        config.headers['Cache-Control'] = 'no-cache, max-age=0, must-revalidate';

        //
        // Configure or override parameters where necessary
        //
        config.params = (config.params === undefined) ? {} : config.params;

        console.debug('SecurityInterceptor::Request', config || $q.when(config));

        return config || $q.when(config);
      },
      response: function(response) {
        console.debug('AuthorizationInterceptor::Response', response || $q.when(response));
        return response || $q.when(response);
      },
      responseError: function (response) {
        console.debug('AuthorizationInterceptor::ResponseError', response || $q.when(response));

        if (response.status === 403) {
            window.location.href = '/user/logout';
        }

        return $q.reject(response);
      }
    };
  }).config(function ($httpProvider) {
    $httpProvider.interceptors.push('SecurityInterceptor');
  });
