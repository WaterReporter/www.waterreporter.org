'use strict';

/**
 * @ngdoc overview
 * @name waterReporterApp
 * @description
 *     The WaterReporter Website and associated User/Manager Site
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
