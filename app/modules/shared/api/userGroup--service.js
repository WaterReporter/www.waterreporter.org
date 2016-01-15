(function() {

  'use strict';

  /**
   * @ngdoc service
   * @name WaterReporter
   * @description
   * Provides access to the Group endpoint of the WaterReporter API
   * Service in the WaterReporter.
   */
  angular.module('WaterReporter')
    .service('UserGroup', function (environment, $resource) {
      return $resource(environment.apiUrl.concat('/v1/data/group/:id'), {
        id: '@id'
      }, {
        update: {
          method: 'PATCH'
        },
        remove: {
          method: 'DELETE'
        }
      });
    });

}());
