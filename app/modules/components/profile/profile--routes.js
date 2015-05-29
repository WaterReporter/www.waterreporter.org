'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.profile.config:profile-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the profile page of the application.
 */

angular.module('WaterReporter.profile')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile',
        views: {
          'SiteHeader@': {
            templateUrl: '/modules/shared/views/header--view.html',
          },
          'SiteContent@': {
            templateUrl: '/modules/components/profile/profile--view.html',
            controller: 'ProfileController',
            controllerAs: 'profile'
          },
          'SiteFooter@': {
            templateUrl: '/modules/shared/views/footer--view.html',
          }
        }
      });
  });