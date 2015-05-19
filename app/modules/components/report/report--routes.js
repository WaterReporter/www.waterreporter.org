'use strict';

/**
 * @ngdoc overview
 * @name wr.singleReport.config:singleReport-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the single report page of the application.
 */

angular.module('wr.singleReport')
  .config(function ($stateProvider) {
    
    $stateProvider
      .state('report', {
        url: '/report/:reportId',
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