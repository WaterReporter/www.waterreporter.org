'use strict';

/**
 * @ngdoc overview
 * @name wr.singleReport.config:report-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the single report page of the application.
 */

angular.module('WaterReporter.report')
  .config(function ($stateProvider) {
    
    $stateProvider
      .state('report', {
        url: '/reports/:reportId',
        views: {
          'siteHeader@': {
            templateUrl: '/modules/shared/views/header--view.html'
          },
          'siteContent@': {
            templateUrl: '/modules/components/report/report--view.html',
            controller: 'ReportController',
            controllerAs: 'report'
          },
          'siteFooter@': {
            templateUrl: '/modules/shared/views/footer--view.html'
          }
        }
      });

  });