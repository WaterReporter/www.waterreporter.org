(function() {

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
            client_id: environment.clientId,
            redirect_uri: environment.siteUrl.concat('/authorize'),
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

}());
