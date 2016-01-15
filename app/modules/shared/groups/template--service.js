(function() {

  'use strict';

  angular.module('Groups')
    .service('TemplateLoader', function ($compile, $http, $templateCache) {
      return {
        get: function(templateUrl) {

          var promise = $http.get(templateUrl, {
              cache: $templateCache
            }).success(function(html) {
              return html;
            });

          return promise;
        }
      };
    });

}());
