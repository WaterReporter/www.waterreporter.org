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
    'ngAria',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'leaflet-directive',
    'angularPhotoio',
    'ui.gravatar'
  ]);
