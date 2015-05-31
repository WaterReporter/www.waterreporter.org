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

    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    //
    // For any unmatched url, redirect to home
    //
    // @see https://github.com/angular-ui/ui-router/wiki/URL-Routing
    //
    // $urlRouterProvider.otherwise('/');

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