'use strict';

angular.module('WaterReporter').filter('isArray', function() {
  return function (input) {
    return (angular.isArray(input)) ? true : false;
  };
});
