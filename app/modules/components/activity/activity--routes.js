'use strict';

/**
 * @ngdoc overview
 * @name wr.activityFeed.config:activityFeed-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the activity feed page of the application.
 */

angular.module('WaterReporter.activity')
  .config(function ($stateProvider) {
    $stateProvider
      .state('activity', {
        url: '/activity',
        templateUrl: '/modules/components/activity/activity--view.html',
        controller: 'ActivityController',
        controllerAs: 'activityFeed'
      });
  });