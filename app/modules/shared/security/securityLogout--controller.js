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
  .controller('SecurityLogoutController', function (Account, ipCookie, $location, $rootScope) {

    /**
     * Remove all cookies present for authentication
     */
    ipCookie.remove('WATERREPORTER_SESSION');
    ipCookie.remove('WATERREPORTER_SESSION', { path: '/' });

    ipCookie.remove('WATERREPORTER_CURRENTUSER');
    ipCookie.remove('WATERREPORTER_CURRENTUSER', { path: '/' });

    /**
     * 
     */
    $rootScope.user = null;

    Account.userObject = null;

    /**
     * Redirect individuals back to the activity list
     */
    $location.path('/activity/list');
  });
