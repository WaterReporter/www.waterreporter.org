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
    'WaterReporter.home',
    'WaterReporter.about',
    'WaterReporter.activity',
    'WaterReporter.map',
    'WaterReporter.profile',
    'WaterReporter.report',
    'WaterReporter.submit'
  ]);
