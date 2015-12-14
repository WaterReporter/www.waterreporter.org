(function() {

  'use strict';

  /**
   * @ngdoc service
   * @name WaterReporter
   * @description
   * Provides access to the User endpoint of the WaterReporter API
   * Service in the WaterReporter.
   */
  angular.module('WaterReporter')
    .service('User', function (environment, $resource) {
      return $resource(environment.apiUrl.concat('/v1/data/user/:id'), {
        id: '@id'
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PATCH'
        },
        getOrganizations: {
          method: 'GET',
          isArray: false,
          url: environment.apiUrl.concat('/v1/data/user/:id/organization')
        },
        me: {
          method: 'GET',
          url: environment.apiUrl.concat('/v1/data/me')
        },
        classifications: {
          method: 'GET',
          isArray: false,
          url: environment.apiUrl.concat('/v1/data/user/:id/classifications')
        }
      });
    });

}());
