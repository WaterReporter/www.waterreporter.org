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

        console.log('searchScrollToLoad');

        element.bind('scroll', function() {
          console.log('in scroll');
          console.log(raw.scrollTop + raw.offsetHeight);
          console.log(raw.scrollHeight);

          if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
            console.log('APPLY');
            scope.$apply(attrs.searchScrollToLoad);
          }
          else {
            console.log('NOPE');
          }

          console.log('event');
        });

      }
    };
  });