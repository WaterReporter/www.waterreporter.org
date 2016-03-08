(function() {

  'use strict';

  /**
   * @ngdoc service
   * @name WaterReporter
   * @description
   * Provides access to the Organization endpoint of the WaterReporter API
   * Service in the WaterReporter.
   */
  angular.module('WaterReporter')
    .service('Organization', function (environment, $resource) {
      return $resource(environment.apiUrl.concat('/data/organization/:id'), {
        id: '@id'
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PATCH'
        },
        reports: {
          url: environment.apiUrl.concat('/data/organization/:id/reports'),
          method: 'GET',
          isArray: false
        },
        members: {
          url: environment.apiUrl.concat('/data/organization/:id/users'),
          method: 'GET',
          isArray: false
        }
      });
    });

}());
