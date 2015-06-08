'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.activity.config:activity-routes
 * @description
 *     Routes for the states applying to the activity feed page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/activity', {
        templateUrl: '/modules/components/activity/activity--view.html',
        controller: 'ActivityController',
        controllerAs: 'activity',
        reloadOnSearch: false,
        resolve: {
          reports: function($location, $route, Report) { 
            return Report.query($location.search());
          }
        }            
      });
  });