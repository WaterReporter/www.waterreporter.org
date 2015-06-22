'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter
 * @description
 * # WaterReporter
 *
 * Main module of the application.
 */
angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user', {
        redirectTo: '/user/login'
      })
      .when('/user/login', {
        templateUrl: '/modules/shared/security/securityLogin--view.html',
        controller: 'SecurityController',
        controllerAs: 'security'
      })
      .when('/logout', {
        redirectTo: '/user/logout'
      })
      .when('/user/logout', {
        template: 'Logging out ...',
        controller: 'SecurityLogoutController',
        controllerAs: 'security'
      });
  });