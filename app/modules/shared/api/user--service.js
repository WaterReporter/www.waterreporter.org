'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the User endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('User', ['$resource', function ($resource) {
    return $resource('//api.waterreporter.org/v1/user/:userId', {}, {
      query: {
        isArray: false
      },
      update: {
        method: 'PATCH'
      }
    });
  }]);