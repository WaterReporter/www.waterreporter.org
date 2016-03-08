(function() {

  'use strict';

  /**
   * @ngdoc service
   * @name
   * @description
   */
  angular.module('Groups')
    .service('GroupOrganization', function (environment, $resource) {
      return $resource(environment.apiUrl.concat('/data/organization/:id'), {
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
