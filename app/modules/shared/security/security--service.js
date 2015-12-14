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
  .service('Security', function(environment, ipCookie, $http, $resource) {

    var Security = $resource(environment.apiUrl.concat('/login'), {}, {
      save: {
        method: 'POST',
        url: environment.apiUrl.concat('/v1/auth/remote'),
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
        url: environment.apiUrl.concat('/v1/user/register')
      },
      reset: {
        method: 'POST',
        url: environment.apiUrl.concat('/reset')
      }
    });

    Security.has_token = function() {
      return (ipCookie('WATERREPORTER_SESSION')) ? true: false;
    };

    return Security;
  });
