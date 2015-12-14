'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the Report endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('Report', function (environment, $resource) {
    return $resource(environment.apiUrl.concat('/v1/data/report/:id'), {
      id: '@id'
    }, {
      query: {
        isArray: false
      },
      close: {
        method: 'PATCH'
      },
      update: {
        method: 'PATCH'
      },
      comments: {
        method: 'GET',
        url: environment.apiUrl.concat('/v1/data/report/:id/comments'),
        params: {
          q: {
            order_by: [
              {
                field: 'created',
                direction: 'asc'
              }
            ]
          },
          results_per_page: 1000
        }
      }
    });
  });
