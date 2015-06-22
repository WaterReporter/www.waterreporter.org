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

    /**
     * Remove all cookies present for authentication
     */
    ipCookie.remove('WATERREPORTER_SESSION');
    ipCookie.remove('WATERREPORTER_SESSION', { path: '/' });

    ipCookie.remove('WATERREPORTER_CURRENTUSER');
    ipCookie.remove('WATERREPORTER_CURRENTUSER', { path: '/' });

    /**
     * Redirect individuals back to the activity list
     */
    $location.path('/activity/list');
  });
