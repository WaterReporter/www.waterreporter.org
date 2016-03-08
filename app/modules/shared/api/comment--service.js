(function() {

  'use strict';

  /**
   * @ngdoc service
   * @name WaterReporter
   * @description
   * Provides access to the Comment endpoint of the WaterReporter API
   * Service in the WaterReporter.
   */
  angular.module('WaterReporter')
    .service('Comment', function (environment, $resource) {
      return $resource(environment.apiUrl.concat('/data/comment/:id'), {
        id: '@id'
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PATCH'
        }
      });
    });

}());
