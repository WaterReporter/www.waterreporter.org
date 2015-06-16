'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.submit.controller:SubmitController
 * @description
 * # SubmitReportController
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('SubmitController', function ($location, Report) {

    var self = this;

    self.new = new Report();

    self.save = function() {

      self.new.state = 'open';
      self.new.is_public = true;

      self.new.$save(function(response) {
        console.log('response', response);
        $location.path('/reports/');
      });
    };

  });