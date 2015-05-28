'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.submitReport.config:submitReport-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the submit report page of the application.
 */

angular.module('WaterReporter.submitReport')
  .config(function ($stateProvider) {
    
    $stateProvider
      .state('submit-report', {
        url: '/submit-report',
        templateUrl: '/modules/components/submit-report/submitReport-view.html',
        controller: 'SubmitReportController',
        controllerAs: 'submitReport'
      });
      
  });