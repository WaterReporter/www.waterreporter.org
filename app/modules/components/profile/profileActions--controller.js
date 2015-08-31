'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.profile.controller:ProfileController
 * @description
 * # ProfileController
 * Controller of the WaterReporter
 */
angular.module('WaterReporter')
  .controller('ProfileActionsController', function (Account, closures, leafletData, $location, Map, mapbox, mapboxGeometry, Notifications, organizations, profile, Report, $rootScope, $route, Search, $scope, submissions, user) {

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
    self.search = Search;

    self.search.model = {
      report_description: {
        name: 'report_description',
        op: 'ilike',
        val: ''
      }
    };

    this.search.data = closures;

    this.search.resource = Report;

    this.search.params = {
      q: {
        filters: [
          {
            name: 'closed_by__id',
            op: 'has',
            val: $route.current.params.userId
          }
        ],
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
    // Load other data
    //
    this.data = profile;

    this.organizations = organizations;

    this.submissions = submissions;

    this.permissions = {};

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

    this.search.data.$promise.then(function(reports_) {
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
        lng: center.lng,
        zoom: 16
      };

    };

    //
    // This is the first page the authneticated user will see. We need to make
    // sure that their user information is ready to use. Make sure the
    // Account.userObject contains the appropriate information.
    //
    if (Account.userObject && user) {
      user.$promise.then(function(userResponse) {
        $rootScope.user = Account.userObject = userResponse;

        if (!$rootScope.user.properties.first_name || !$rootScope.user.properties.last_name) {
          $rootScope.notifications.warning('Hey!', 'Please <a href="/profiles/' + $rootScope.user.id + '/edit">complete your profile</a> by sharing your name and a photo');
        }

        self.permissions = {
          isLoggedIn: Account.hasToken(),
          isAdmin: Account.hasRole('admin')
        };

        self.permissions.isCurrentUser = ($rootScope.user.id === parseInt($route.current.params.userId)) ? true : false;

        if ($rootScope.user.id === parseInt($route.current.params.userId)) {
          self.permissions.isProfile = true;
        }
      });
    }

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
      if (self.map.expanded === true) {
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

            if (self.map.geojson.reports.data && self.map.geojson.reports.data.features) {
              self.map.geojson.reports.data.features = self.set(self.map.geojson.reports.data.features, response.features);
            } else {
              self.map.geojson.reports.data.features = self.set([], response.features);
            }

            var featureGroup = new L.FeatureGroup();

            self.map.markers = mapboxGeometry.drawMarkers(self.map.geojson.reports.data, featureGroup);
          });

        });
      }
    });

    $scope.$on('leafletDirectiveMap.focus', function() {
      self.map.toggleControls('show');
      self.map.expanded = true;

      var map_ = document.getElementById('map--wrapper');
      map_.className = 'map--wrapper map--wrapper--expanded';

      leafletData.getMap().then(function(map) {
        map.invalidateSize();
      });
    });

    // $scope.$on('leafletDirectiveMap.blur', function() {
    //   self.map.toggleControls('hide');
    //   self.map.expanded = false;
    //
    //   var map_ = document.getElementById('map--wrapper');
    //   map_.className = 'map--wrapper';
    //
    //   leafletData.getMap().then(function(map) {
    //     map.invalidateSize();
    //   });
    // });

    $scope.$on('leafletDirectiveMarker.click', function(event, args) {
      $location.path(self.map.markers[args.modelName].permalink);
    });

  });
