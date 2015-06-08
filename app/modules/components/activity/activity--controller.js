'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.activity.controller:ActivityFeedController
 * @description
 * # ActivityFeedController
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('ActivityController', function ($location, Report, reports, Search) {

    //
    // Tell the 
    //
    this.reports = reports;

    //
    // Let this controller know we are going to be adding a search to our
    // public facing view
    //
    this.search = Search;

    this.search.params = Search.defaults();

    //
    // Tell the Search service about the type of content we'll be search
    //
    this.search.model = {
      report_description: {
        name: 'report_description',
        op: 'ilike',
        val: ''
      }
    };

    //
    //
    //
    this.search.resource = Report;

    //
    // Tell the Search about the data we'll be using
    //
    this.search.data = this.reports;

  });