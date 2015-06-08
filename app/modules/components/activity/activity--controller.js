'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.activity.controller:ActivityFeedController
 * @description
 * # ActivityFeedController
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('ActivityController', function (Report, reports, Search) {

    /**
     * Setup search capabilities for the Report Activity Feed
     *
     * @data this.search
     *    loads the Search Service into our page scope
     * @data this.search.params
     *    loads the default url parameters into the page fields
     * @data this.search.model
     *    tells the Search Service what the data model for this particular search looks like
     * @data this.search.resource
     *    tells the Search Service what resource to perform the search with
     * @data this.search.data
     *    retains and updates based on the features returned from the user-defined query
     *
     */
    this.search = Search;

    this.search.params = Search.defaults();

    this.search.model = {
      report_description: {
        name: 'report_description',
        op: 'ilike',
        val: ''
      }
    };

    this.search.resource = Report;

    this.search.data = reports;

  });