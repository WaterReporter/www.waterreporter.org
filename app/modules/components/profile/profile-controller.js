'use strict';

/**
 * @ngdoc function
 * @name wr.profile.controller:ProfileController
 * @description
 * # ProfileController
 * Controller of the waterReporterApp
 */
angular.module('wr.profile')
  .controller('ProfileController', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });