'use strict';

/*jshint camelcase:false*/

/**
 * @ngdoc service
 * @name WaterReporter.Security
 * @description
 * # Security
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('Security', function(ipCookie, $http, $resource) {

    var Security = $resource('//api.waterreporter.org/login', {}, {
      save: {
        method: 'POST',
        url: '//api.waterreporter.org/v1/auth/remote',
        params: {
          response_type: 'token',
          client_id: 'SG92Aa2ejWqiYW4kI08r6lhSyKwnK1gDN2xrryku',
          redirect_uri: 'http://127.0.0.1:9000/authorize',
          scope: 'user',
          state: 'json'
        }
      },
      register: {
        method: 'POST',
        url: '//api.waterreporter.org/v1/user/register'
      }
    });

    Security.has_token = function() {
      return (ipCookie('WATERREPORTER_COMMERCE_SESSION')) ? true: false;
    };

    return Security;
  });
