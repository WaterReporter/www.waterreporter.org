'use strict';

/**
 * @ngdoc overview
 * @name wr.home.config:home-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the home page of the application.
 */

angular.module('WaterReporter.home')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/modules/components/home/home--view.html',
        controller: 'HomeController',
        controllerAs: 'home'
      });
  });