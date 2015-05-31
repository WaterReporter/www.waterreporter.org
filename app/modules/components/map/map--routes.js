'use strict';

/**
 * @ngdoc overview
 * @name wr.map.config:map-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the map page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/map', {
        templateUrl: '/modules/components/map/map--view.html',
        controller: 'MapController',
        controllerAs: 'map'
      });
  });