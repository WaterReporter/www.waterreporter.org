'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.about.config:about-routes
 * @description
 *     Routes for the states applying to the about page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/about', {
        templateUrl: '/modules/components/about/about--view.html',
        controller: 'AboutController',
        controllerAs: 'about'
      });
  });