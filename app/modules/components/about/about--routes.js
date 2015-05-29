'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.about.config:about-routes
 * @description
 *     Routes for the states applying to the about page of the application.
 */

angular.module('WaterReporter.about')
  .config(function ($stateProvider) {
    $stateProvider
      .state('about', {
        url: '/about',
        views: {
          'SiteHeader@': {
            templateUrl: '/modules/shared/views/header--view.html',
          },
          'SiteContent@': {
            templateUrl: '/modules/components/about/about--view.html',
            controller: 'AboutController',
            controllerAs: 'about'
          },
          'SiteFooter@': {
            templateUrl: '/modules/shared/views/footer--view.html',
          }
        }
      });
  });