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
  .config(function wrSingleReportRoutes ($stateProvider) {
    $stateProvider
      .state('single-report', {
        url: '/single-report',
        templateUrl: '/modules/components/single-report/singleReport-view.html',
        controller: 'SingleReportController',
        controllerAs: 'singleReport'
      });
  });