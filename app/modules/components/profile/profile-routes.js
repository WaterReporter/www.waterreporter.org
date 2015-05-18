'use strict';

/**
 * @ngdoc overview
 * @name wr.profile.config:profile-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the profile page of the application.
 */

angular.module('wr.profile')
  .config(function wrProfileRoutes ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile',
        templateUrl: '/modules/components/profile/profile-view.html',
        controller: 'ProfileController',
        controllerAs: 'profile'
      });
  });