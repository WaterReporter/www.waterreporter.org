(function() {

  'use strict';

  /**
   * @ngdoc function
   * @name WaterReporter.submit.controller:SubmitController
   * @description
   * # SubmitReportController
   * Controller of the waterReporterApp
   */
  angular.module('WaterReporter')
    .controller('ReportEditController', function (Account, Image, leafletData, $location, Map, Notifications, report, Report, $rootScope, $scope, user) {

      var self = this;

      $rootScope.page = {
        class: 'map--controls--visible'
      };

      self.image = null;

      //
      // Setup all of our basic date information so that we can use it
      // throughout the page
      //
      self.today = new Date();

      self.days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ];

      self.months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ];

      //
      // Define the generic map
      //
      self.map = Map;

      //
      // Create a new Date object and assign to today so that we have some
      // default to work with
      //
      self.report = report;

      report.$promise.then(function(response) {
        self.report = response;

        self.coordinates = {
          lng: self.report.geometry.geometries[0].coordinates[0],
          lat: self.report.geometry.geometries[0].coordinates[1]
        };

        //
        // We mush reset the Markers and Center to ensure that they are not
        // being retain by the Map service from previous pages.
        //
        self.map.markers = {
          reportGeometry: {
            lng: self.coordinates.lng,
            lat: self.coordinates.lat,
            message: 'Drag me to update your location',
            focus: true,
            draggable: true
          }
        };

        self.map.center = {
          lng: self.coordinates.lng,
          lat: self.coordinates.lat,
          zoom: 15
        };
      });

      //
      // We use this function for handle any type of geographic change, whether
      // through the map or through the fields
      //
      self.map.processPin = function(coordinates, zoom) {

        if (coordinates.lat === null || coordinates.lat === undefined || coordinates.lng === null || coordinates.lng === undefined) {
          console.log('Invalid coordinates, existing pin processing');
          return;
        }

        console.log('coordinates changed', coordinates)

        //
        // Move the map pin/marker and recenter the map on the new location
        //
        self.map.markers = {
          reportGeometry: {
            lng: coordinates.lng,
            lat: coordinates.lat,
            focus: false,
            draggable: true
          }
        };

        //
        // Update the coordinates for the Report
        //
        self.report.geometry = {
          type: 'GeometryCollection',
          geometries: []
        };

        self.report.geometry.geometries.push({
          type: 'Point',
          coordinates: [
            coordinates.lng,
            coordinates.lat
          ]
        });


        leafletData.getMap().then(function(map) {
          map.invalidateSize();

          zoom = (zoom) ? zoom : map._zoom;

          self.map.center = {
            lng: coordinates.lng,
            lat: coordinates.lat,
            zoom: zoom
          };
        });

      };

      /**
       * Take our three separate date fields (i.e., month, day, year) and on
       * field updates change the report.report_date scoped object so that it
       * builds a proper Date object for our Report $resource
       */
      self.date = {
        month: self.months[self.today.getMonth()],
        date: self.today.getDate(),
        day: self.days[self.today.getDay()],
        year: self.today.getFullYear()
      };

      $scope.$watch(angular.bind(this, function() {
        return this.date;
      }), function (response) {
        var _new = response.month + ' ' + response.date + ' ' + response.year,
            _date = new Date(_new);

        self.date.day = self.days[_date.getDay()];

        self.report.report_date = _date;
      }, true);

      self.status = {
        saving: {
          action: false,
          message: null
        }
      };


      //
      // Save the changes to the report
      //
      self.save = function() {

        self.status.saving.action = true;

        self.status.saving.message = 'Updating your report...';

        var report = new Report({
          id: self.report.id,
          report_date: self.report.properties.report_date,
          report_description: self.report.properties.report_description,
          geometry: self.report.geometry,
          state: self.report.properties.state
        });

        console.log('report', report);

        report.$update({
          id: report.id
        }, function(response) {
          $location.path('/reports/' + response.id);
        });
      };


      //
      // Define our map interactions via the Angular Leaflet Directive
      //
      leafletData.getMap().then(function(map) {

        //
        // Update the pin and segment information when the user clicks on the map
        // or drags the pin to a new location
        //
        $scope.$on('leafletDirectiveMap.click', function(event, args) {
          self.map.processPin(args.leafletEvent.latlng, map._zoom);
        });

        $scope.$on('leafletDirectiveMap.dblclick', function(event, args) {
          self.map.processPin(args.leafletEvent.latlng, map._zoom+1);
        });

        $scope.$on('leafletDirectiveMarker.dragend', function(event, args) {
          self.map.processPin(args.leafletEvent.target._latlng, map._zoom);
        });

        $scope.$on('leafletDirectiveMarker.dblclick', function(event, args) {
          var zoom = map._zoom+1;
          map.setZoom(zoom);
        });

      });

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


    });

}());
