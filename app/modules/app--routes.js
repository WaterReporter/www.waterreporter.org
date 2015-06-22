'use strict';

/**
 * @ngdoc overview
 * @name waterReporterApp
 * @description
 *     The WaterReporter Website and associated User/Manager Site
 *     Main routes of the application.
 */
angular.module('WaterReporter')
  .config(function ($locationProvider, $routeProvider) {

    //
    // For any unmatched url, redirect to home
    //
    $routeProvider
      .otherwise({
        redirectTo: '/activity/list'
      });

    //
    // Make sure that HTML mode is enabled
    //
    // @see https://docs.angularjs.org/api/ng/provider/$locationProvider#html5Mode
    //
    // Requires:
    //
    //    `<base href="/" />`
    //
    $locationProvider.html5Mode(true);
  });