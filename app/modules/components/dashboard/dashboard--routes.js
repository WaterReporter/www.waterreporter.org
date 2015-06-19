'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.singleReport.config:report-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the single report page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    
    $routeProvider
      .when('/dashboard', {
        templateUrl: '/modules/components/dashboard/dashboard--view.html',
        controller: 'DashboardController',
        controllerAs: 'dashboard'
      });

  });