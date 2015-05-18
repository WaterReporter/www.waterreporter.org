'use strict';

/**
 * @ngdoc overview
 * @name waterReporterApp
 * @description
 * # waterReporterApp
 *
 * Main module of the application.
 */
angular
  .module('waterReporterApp', [
    'ngAria',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'leaflet-directive',
    'wr.home',
    'wr.about',
    'wr.activityFeed',
    'wr.map',
    'wr.profile',
    'wr.singleReport',
    'wr.submitReport'
  ]);
