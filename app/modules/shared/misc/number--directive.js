(function() {

  'use strict';

  angular.module('WaterReporter')
    .directive('number', function() {
  	return {
  		restrict: 'A',
  		link: function(scope, element){

        var disable = function () {
  				element[0].blur();
  			};

  			element.bind('mousewheel', disable);
  		}
  	};
  });

}());
