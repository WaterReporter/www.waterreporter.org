'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.report.controller:SingleReportController
 * @description
 *     Display a single report based on the current `id` provided in the URL
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('ReportController', function ($rootScope, report) {

    var self = this;

    self.report = report;

    console.log('report', report);

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

  });