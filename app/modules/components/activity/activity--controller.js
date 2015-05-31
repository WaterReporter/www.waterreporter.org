'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.activity.controller:ActivityFeedController
 * @description
 * # ActivityFeedController
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('ActivityController', function (reports) {

    this.reports = reports;
    
  });