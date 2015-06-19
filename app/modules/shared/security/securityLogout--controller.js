'use strict';

/*jshint camelcase:false*/

/**
 * @ngdoc function
 * @name WaterReporter.controller:SecurityController
 * @description
 * # SecurityController
 * Controller of the WaterReporter
 */
angular.module('WaterReporter')
  .controller('SecurityLogoutController', function (ipCookie, $location) {

    ipCookie.remove('WATERREPORTER_SESSION', {path: '/'});
    ipCookie.remove('WATERREPORTER_CURRENTUSER', {path: '/'});

    $location.path('/activity/list');

  });
