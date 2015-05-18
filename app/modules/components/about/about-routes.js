'use strict';

/**
 * @ngdoc overview
 * @name wr.about.config:about-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the about page of the application.
 */

angular.module('wr.about')
  .config(function wrAboutRoutes ($stateProvider) {
    $stateProvider
      .state('about', {
        url: '/about',
        templateUrl: '/modules/components/about/about-view.html',
        controller: 'AboutController',
        controllerAs: 'about'
      });
  });