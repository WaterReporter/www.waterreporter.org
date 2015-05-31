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
      .when('/reports/:reportId', {
        templateUrl: '/modules/components/report/report--view.html',
        controller: 'ReportController',
        controllerAs: 'report',
        resolve: {
          report: function($route, Report) {
            return Report.get({
              id: $route.current.params.reportId
            });
          }
        }
      });

  });