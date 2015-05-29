'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the Report endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('Report', ['$resource', function ($resource) {
    return $resource('//api.waterreporter.org/v1/report/:reportId', {}, {
      query: {
        isArray: false
      },
      update: {
        method: 'PATCH'
      }
    });
  }]);