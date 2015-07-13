'use strict';

/**
 * @ngdoc function
 * @name
 * @description
 */
angular.module('WaterReporter')
  .controller('CommunityController', function (Account, leafletData, Map, mapbox, mapboxGeometry, Report, reports, $rootScope, $scope, Search, user) {

    var self = this;

    $rootScope.user = Account.userObject;

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
     * This is the first page the authneticated user will see. We need to make
     * sure that their user information is ready to use. Make sure the
     * Account.userObject contains the appropriate information.
     */
    if (Account.userObject && !Account.userObject.id) {
      if (user) {
        user.$promise.then(function(userResponse) {
          Account.userObject = userResponse;
            $rootScope.user = Account.userObject;

            $rootScope.isLoggedIn = Account.hasToken();
            $rootScope.isAdmin = Account.hasRole('admin');
        });
      }
    }

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

    $scope.$watch(angular.bind(this, function () {
      return this.search;
    }), function () {
        if (self.search && self.search.data) {
            self.loadMap();
         }
    }, true);

    this.loadMap = function() {
      self.search.data.$promise.then(function(reports_) {
          self.map.geojson.reports = {
              data: reports_
          };

          //
          // Define a layer to add geometries to later
          //
          // @see http://leafletjs.com/reference.html#featuregroup
          //
          var featureGroup = new L.FeatureGroup();

          var layerStyle = self.map.styles.icon.parcel;

          mapboxGeometry.drawGeoJSON(self.map.geojson.reports.data, featureGroup, layerStyle);

           //
           // @hack
           //    this is only a temporary solution until we get the new `bbox`
           //    functionality within the WaterReporter API
           //
          leafletData.getMap().then(function(map) {
              var bounds = featureGroup.getBounds();

              if (bounds && bounds._southWest !== undefined) {
                  map.fitBounds(featureGroup.getBounds());
              }
          });
       });
    };

  });
