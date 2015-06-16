'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.submit.config:submitReport-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the submit report page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    
    $routeProvider
      .when('/submit', {
        redirectTo: '/reports/submit'
      })
      .when('/reports/submit', {
        templateUrl: '/modules/components/submit/submit--view.html',
        controller: 'SubmitController',
        controllerAs: 'submit'
      });
      
  });