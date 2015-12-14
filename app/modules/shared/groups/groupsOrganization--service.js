(function() {

  'use strict';

  /**
   * @ngdoc service
   * @name
   * @description
   */
  angular.module('Groups')
    .service('GroupOrganization', function ($resource) {
      return $resource('//api.waterreporter.org/v1/data/organization/:id', {
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
