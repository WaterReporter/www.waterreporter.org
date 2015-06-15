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
  .service('Security', ['$cookies', '$http', '$resource', function($cookies, $http, $resource) {

    var Security = $resource('https://api.snapology.com/login', {}, {
      save: {
        method: 'POST',
        url: 'https://api.snapology.com/oauth/remote',
        params: {
          response_type: 'token',
          client_id: 'SbanCzYpm0fUW8md1cdSJjUoYI78zTbak2XhZ2hC',
          redirect_uri: 'http://localhost:9000/authorize',
          scope: 'user applications',
          state: 'json'
        }
      },
      register: {
        method: 'POST',
        url: 'https://api.snapology.com/account/create'
      }
    });

    Security.has_token = function() {
      return ($cookies.SNAPOLOGY_COMMERCE_SESSION) ? true: false;
    };

    return Security;
  }]);
