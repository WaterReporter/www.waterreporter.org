'use strict';

/**
 * @ngdoc overview
 * @name wr.activityFeed.config:activityFeed-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the activity feed page of the application.
 */

angular.module('wr.activityFeed')
  .config(function wrActivityFeedRoutes ($stateProvider) {
    $stateProvider
      .state('activity-feed', {
        url: '/activity-feed',
        templateUrl: '/modules/components/activity-feed/activityFeed-view.html',
        controller: 'ActivityFeedController',
        controllerAs: 'activityFeed'
      });
  });