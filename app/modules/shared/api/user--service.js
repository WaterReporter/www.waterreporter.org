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
    return $resource('//api.waterreporter.org/v1/data/user/:id', {
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
        url: '//api.waterreporter.org/v1/data/user/:id/organization'
      },
      me: {
        method: 'GET',
        url: '//api.waterreporter.org/v1/data/user/me'
      }
    });
  }]);