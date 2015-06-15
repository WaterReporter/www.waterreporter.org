'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.profile.config:profile-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the profile page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/profile', {
        templateUrl: '/modules/components/profile/profile--view.html',
        controller: 'ProfileController',
        controllerAs: 'profile'
      })
      .when('/profile/:userId', {
        templateUrl: '/modules/components/profile/profiles--view.html',
        controller: 'ProfilesController',
        controllerAs: 'profile'
      });
  });