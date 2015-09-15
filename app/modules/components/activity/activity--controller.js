(function() {

  'use strict';

  /**
   * @ngdoc function
   * @name
   * @description
   */
  angular.module('WaterReporter')
    .controller('ActivityController', function (Account, features, $location, leafletData, leafletEvents, Map, mapbox, mapboxGeometry, Notifications, Report, reports, $rootScope, Search, $scope, user) {

      var self = this;

      self.markers = null;

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

      this.search.resource = Report;

      this.search.page = 1;

      this.search.data = reports;

      this.search.params = {
        q: {
          order_by: [
            {
              field: 'report_date',
              direction: 'desc'
            },
            {
              field: 'id',
              direction: 'desc'
            }
          ]
        },
        page: 1
      };

      //
      // This is the first page the authneticated user will see. We need to make
      // sure that their user information is ready to use. Make sure the
      // Account.userObject contains the appropriate information.
      //
      if (Account.userObject && user) {
        user.$promise.then(function(userResponse) {
          $rootScope.user = Account.userObject = userResponse;

          self.permissions = {
            isLoggedIn: Account.hasToken(),
            isAdmin: Account.hasRole('admin'),
            isProfile: false
          };

          if (!$rootScope.user.properties.first_name || !$rootScope.user.properties.last_name) {
            $rootScope.notifications.warning('Hey!', 'Please <a href="/profiles/' + $rootScope.user.id + '/edit">complete your profile</a> by sharing your name and a photo');
          }

        });
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

      this.map.center = null;

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

          self.map.markers = {};

          self.markers = mapboxGeometry.drawMarkers(self.map.geojson.reports.data, featureGroup);

          //
          // Define the first/newest Feature and center the map on it
          //
          self.changeFeature(self.map.geojson.reports.data.features[0], 0);
       });

       $scope.$on('leafletDirectiveMarker.click', function(event, args) {
         $location.path(self.map.markers[args.modelName].permalink);
       });

       $scope.$on('leafletDirectiveMap.focus', function() {
         self.map.toggleControls('show');
         self.vignette = false;

         var vignette = document.getElementById('map--vignette');
         vignette.className = 'map--vignette map--vignette--hidden';
       });


      this.hideVignette = function() {

        self.vignette = false;

        var vignette = document.getElementById('map--vignette');
        vignette.className = 'map--vignette map--vignette--hidden';

        var feature = document.getElementById('map--featured');
        feature.className = 'map--featured map--feature--hidden';

        var map_ = document.getElementById('map--wrapper');
        map_.className = 'map--wrapper map--wrapper--expanded';

        self.map.markers = self.markers;

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

        self.map.markers = {};

        self.map.toggleControls('hide');

        leafletData.getMap().then(function(map) {
          map.invalidateSize();
        });
      };

      this.changeFeature = function(feature, index) {
        if (feature && feature.geometry !== undefined) {
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
        }
      };

      // self.key = function($event) {
      //
      //   var index;
      //
      //   if ($event.keyCode === 39) {
      //     if (self.features.visible < self.map.geojson.reports.data.features.length) {
      //       index = self.features.visible+1;
      //       self.changeFeature(self.map.geojson.reports.data.features[index], index);
      //     }
      //   } else if ($event.keyCode === 37) {
      //     if (self.features.visible <= self.map.geojson.reports.data.features.length) {
      //       index = self.features.visible-1;
      //       self.changeFeature(self.map.geojson.reports.data.features[index], index);
      //     }
      //   }
      // };

      self.unique = function(report, list) {

        for (var index = 0; index < list.length; index++) {
          if (report.id === list[index].id) {
            return false;
          }
        }

        return true;
      };

      self.set = function(existingReports, newReports) {

        var reports = existingReports;

        angular.forEach(newReports, function(report){
          if (self.unique(report, existingReports)) {
            reports.push(report);
          }
        });

        return reports;
      };

      //
      // If the vignette is disabled make sure we're listening for map movement
      //
      $scope.$on('leafletDirectiveMap.moveend', function() {
        if (self.vignette === false) {
          leafletData.getMap().then(function(map) {

            var bounds = map.getBounds(),
                top = bounds._northEast.lat,
                bottom = bounds._southWest.lat,
                left = bounds._southWest.lng,
                right = bounds._northEast.lng,
                polygon = left + ' ' + top + ',' + right + ' ' + top + ',' + right + ' ' + bottom + ',' + left + ' ' + bottom + ',' + left + ' ' + top;

            Report.query({
              q: {
                filters: [
                  {
                    name: 'geometry',
                    op: 'intersects',
                    val: 'SRID=4326;POLYGON((' + polygon + '))'
                  }
                ]
              }
            }).$promise.then(function(response) {

              self.map.geojson.reports.data.features = self.set(self.map.geojson.reports.data.features, response.features);

              var featureGroup = new L.FeatureGroup();

              self.map.markers = mapboxGeometry.drawMarkers(self.map.geojson.reports.data, featureGroup);
            });

          });
        }
      });

    });

}());
