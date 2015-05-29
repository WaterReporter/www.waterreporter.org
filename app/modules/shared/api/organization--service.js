'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the Organization endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('Organization', ['$resource', function ($resource) {
    return $resource('//api.waterreporter.org/v1/organization/:organizationId', {}, {
      query: {
        isArray: false
      },
      update: {
        method: 'PATCH'
      }
    });
  }]);