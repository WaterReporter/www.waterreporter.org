'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the Search endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .directive('searchScrollToLoad', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
      
        var raw = element[0];

        element.bind('scroll', function() {
          if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
            scope.$apply(attrs.searchScrollToLoad);
          }
        });

      }
    };
  });