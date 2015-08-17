(function() {

  'use strict';

  /**
   * @ngdoc function
   * @name
   * @description
   */
  angular.module('WaterReporter')
    .controller('ActivityController', function (Account, features, $location, leafletData, leafletEvents, Map, mapbox, mapboxGeometry, Report, reports, $rootScope, $scope, Search, user) {

      var self = this;

      /**
       * Setup our Features so that they appear on the home page in the
       * appropriate position
       */
      this.features = features;

      this.vignette = true;

      this.permissions = {};

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
            $rootScope.user = Account.userObject = userResponse;

            self.permissions = {
              isLoggedIn: Account.hasToken(),
              isAdmin: Account.hasRole('admin'),
              isProfile: false
            };

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

      self.features.$promise.then(function(reports_) {
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

          leafletData.getMap().then(function(map) {

            $scope.$on('leafletDirectiveMarker.click', function(event, args) {
              $location.path(self.map.markers[args.modelName].permalink);
            });

            $scope.$on('leafletDirectiveMap.focus', function() {
              self.map.toggleControls('show');
              self.vignette = false;

              var vignette = document.getElementById('map--vignette');
              vignette.className = 'map--vignette map--vignette--hidden';
            // });
            //
            // $scope.$on('leafletDirectiveMap.blur', function() {
            //   self.map.toggleControls('hide');
            //   self.vignette = true;
            //
            //   var vignette = document.getElementById('map--vignette');
            //   vignette.className = 'map--vignette map--vignette--hidden';
            });

          });

       });

      this.hideVignette = function() {

        self.vignette = false;

        var vignette = document.getElementById('map--vignette');
        vignette.className = 'map--vignette map--vignette--hidden';

        var feature = document.getElementById('map--featured');
        feature.className = 'map--featured map--feature--hidden';

        var map_ = document.getElementById('map--wrapper');
        map_.className = 'map--wrapper map--wrapper--expanded';

        self.map.toggleControls('show');

        leafletData.getMap().then(function(map) {
          map.invalidateSize();
        });
      };

      this.showVignette = function() {

        self.vignette = true;

        var vignette = document.getElementById('map--vignette');
        vignette.className = 'map--vignette';

        var feature__ = document.getElementById('map--featured');
        feature__.className = 'map--featured';

        var map_ = document.getElementById('map--wrapper');
        map_.className = 'map--wrapper';

        self.map.toggleControls('hide');

        leafletData.getMap().then(function(map) {
          map.invalidateSize();
        });
      };

      this.changeFeature = function(feature, index) {

        self.features.visible = index;

        var center = {
          lat: feature.geometry.geometries[0].coordinates[1],
          lng: feature.geometry.geometries[0].coordinates[0]
        };

        self.map.center = {
          lat: center.lat,
          lng: center.lng,
          zoom: 16
        };

        if (self.vignette === false) {
          self.showVignette();
        }
      };

      self.key = function($event) {

        if ($event.keyCode === 39) {
          if (self.features.visible < self.map.geojson.reports.data.features.length) {
            var index = self.features.visible+1;
            self.changeFeature(self.map.geojson.reports.data.features[index], index);
          }
        } else if ($event.keyCode === 37) {
          if (self.features.visible <= self.map.geojson.reports.data.features.length) {
            var index = self.features.visible-1;
            self.changeFeature(self.map.geojson.reports.data.features[index], index);
          }
        }
      };

    });

}());
