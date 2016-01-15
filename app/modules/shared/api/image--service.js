(function() {

  'use strict';

  /**
   * @ngdoc service
   * @name WaterReporter
   * @description
   * Provides access to the Image endpoint of the WaterReporter API
   * Service in the WaterReporter.
   */
  angular.module('WaterReporter')
    .service('Image', function (environment, $resource) {
      return $resource(environment.apiUrl.concat('/v1/media/image/:imageId'), {}, {
        query: {
          isArray: false
        },
        upload: {
          method: 'POST',
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        },
        update: {
          method: 'PATCH'
        },
        remove: {
          method: 'DELETE',
          url: environment.apiUrl.concat('/v1/data/image/:imageId')
        }
      });
    });

}());
