(function() {

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
      return $resource(environment.apiUrl.concat('/data/report/:id'), {
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
        groups: {
          method: 'GET',
          isArray: false,
          url: environment.apiUrl.concat('/data/report/:id/groups')
        },
        comments: {
          method: 'GET',
          url: environment.apiUrl.concat('/data/report/:id/comments'),
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

}());
