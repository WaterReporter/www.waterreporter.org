'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter
 * @description
 *     The WaterReporter Website and associated User/Manager Site
 * Main module of the application.
 */
angular
  .module('WaterReporter', [
    'ngCookies',
    'ipCookie',
    'ngAria',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngTouch',
    'leaflet-directive',
    'angularMoment',
    'igTruncate',
    'Mapbox',
    'Groups',
    'config'
  ]);
