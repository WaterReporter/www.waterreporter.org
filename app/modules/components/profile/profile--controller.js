'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.profile.controller:ProfileController
 * @description
 * # ProfileController
 * Controller of the WaterReporter
 */
angular.module('WaterReporter')
  .controller('ProfileController', function (closures, leafletData, $location, Map, mapbox, mapboxGeometry, organizations, profile, reports, $scope) {

    var self = this;

    this.data = profile;
    this.organizations = organizations;

    this.reports = reports;

    this.closures = closures;

    this.visible = {
      reports: true,
      closures: false
    };

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

    L.Icon.Default.imagePath = '/images';

    self.reports.$promise.then(function(reports_) {
        self.map.geojson.reports = {
            data: reports_
        };

        //
        // Define a layer to add geometries to later
        //
        // @see http://leafletjs.com/reference.html#featuregroup
        //
        var featureGroup = new L.FeatureGroup();

        self.map.markers = mapboxGeometry.drawMarkers(self.map.geojson.reports.data, featureGroup);

        //
        // Define the first/newest Feature and center the map on it
        //
        self.changeFeature(self.map.geojson.reports.data.features[0], 0);

        leafletData.getMap().then(function() {
          $scope.$on('leafletDirectiveMarker.click', function(event, args) {
            $location.path(self.map.markers[args.modelName].permalink);
          });
        });

     });

    this.changeFeature = function(feature, index) {

      var center = {
        lat: feature.geometry.geometries[0].coordinates[1],
        lng: feature.geometry.geometries[0].coordinates[0]
      };

      self.map.center = {
        lat: center.lat,
        lng: center.lng-0.0065,
        zoom: 16
      };

    };

  });
