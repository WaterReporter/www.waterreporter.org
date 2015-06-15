'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.map.controller:MapController
 * @description
 * # MapController
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('MapController', function (leafletData, Map, mapbox, Report, reports, Search) {

    var self = this;

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


    /**
     * Setup the Mapbox map for this page with the results we got from the API
     *
     * @data this.map
     *    loads the Map Service into our page scope
     * @data this.map.geojson.reports
     *    loads the request report information into the map
     *
     */
     this.map = Map;

     reports.$promise.then(function(reports_) {
        self.map.geojson.reports = {
            data: reports_,
            styles: self.map.styles.icon.parcel
        };

        self.map.bounds = self.map.getBounds();
     });

  });