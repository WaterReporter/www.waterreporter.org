'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.report.controller:SingleReportController
 * @description
 *     Display a single report based on the current `id` provided in the URL
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('ReportController', function ($rootScope, report, Report, $route) {

    var self = this;

    self.data = report;

    /**
     * Setup Pinterest Rich Pins `<meta>` tags. Each of our Report objects
     * will their own Pinterest Rich Pins page
     *
     * @see https://developers.pinterest.com/rich_pins_place/
     */
    $rootScope.meta = {
      og: {
        site_name: 'WaterReporter',
        title: 'Name of place',
        type: 'place',
        description: 'Description of the place',
        url: 'https://www.waterreporter.org/reports/1'
      },
      place: {
        location: {
          longitude: null,
          latitude: null
        }
      }
    };


    /**
     * Open Report functionality to the Cotnroller
     */
     self.close = function(reportId) {
       Report.close({
        id: reportId,
        state: 'closed'
       }).$promise.then(function(response) {
         console.log('response', response);
         $route.reload();
       });
     };

     self.delete = function(reportId) {
       Report.delete({
        id: reportId        
       }).$promise.then(function(response) {
         console.log('response', response);
       });
     };

  });