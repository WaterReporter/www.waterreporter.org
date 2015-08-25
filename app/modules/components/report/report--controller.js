'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.report.controller:SingleReportController
 * @description
 *     Display a single report based on the current `id` provided in the URL
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('ReportController', function (Account, comments, Comment, Image, ipCookie, leafletData, Map, mapbox, mapboxGeometry, $location, $rootScope, report, Report, $route, $scope, Search, user) {

    var self = this;

    self.image = null;

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

    self.permissions = {};

    /**
     * Setup the User object so that we can determine the type of authentication,
     * user permissions, and if the current page is the profile page.
     *
     * @param (object) A User $promise
     */
    if (user) {
      user.$promise.then(function(userResponse) {
        $rootScope.user = Account.userObject = userResponse;

        self.permissions.isLoggedIn = Account.hasToken();
        self.permissions.isAdmin = Account.hasRole('admin');
        self.permissions.isProfile = false;

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

    this.map.geojson = {
      reports: {
        data: {
          features: []
        }
      }
    }

    this.map.expanded = false;

    report.$promise.then(function(reportResponse) {

      self.report = reportResponse;

      self.permissions.isOwner = (ipCookie('WATERREPORTER_CURRENTUSER') === self.report.properties.owner_id) ? true : false;

      //
      // Now that we have the Report fully loaded into the page we can request
      // additional posts by this user
      //
      if (self.report.properties.owner_id) {
        self.otherReports(self.report.properties.owner_id);
      }

      /**
       * Setup Pinterest Rich Pins `<meta>` tags. Each of our Report objects
       * will their own Pinterest Rich Pins page
       *
       * @see https://developers.pinterest.com/rich_pins_place/
       */
      var watershed = (self.report.properties.territory) ? ' in the ' + self.report.properties.territory.properties.huc_8_name + ' Watershed': '';

      $rootScope.meta = {
        og: {
          site_name: 'WaterReporter',
          title: 'Citizen Water Report' + watershed,
          type: 'place',
          description: (self.report.properties.report_description) ? self.report.properties.report_description: 'A report in the ' + self.report.properties.territory.properties.huc_8_name + ' watershed',
          url: 'https://www.waterreporter.org/reports/' + self.report.id
        },
        place: {
          location: {
            longitude: (self.report.geometry.geometries.length) ? self.report.geometry.geometries[0].coordinates[1] : null,
            latitude: (self.report.geometry.geometries.length) ? self.report.geometry.geometries[0].coordinates[0] : null
          }
        }
      };

      //
      // Define a layer to add geometries to later
      //
      // @see http://leafletjs.com/reference.html#featuregroup
      //
      var featureGroup = new L.FeatureGroup();

      self.map.markers = [mapboxGeometry.drawMarker(self.report, featureGroup)];

      //
      // Define the first/newest Feature and center the map on it
      //
      self.changeFeature(reportResponse, 0);
    });

    self.comments = comments;

    self.otherReports = function(userId) {

      if (!userId) {
        return;
      }

      var params = {
        q: {
          filters: [
            {
              name: 'owner_id',
              op: 'eq',
              val: userId
            },
            {
              name: 'id',
              op: 'neq',
              val: $route.current.params.reportId
            }
          ],
          order_by: [
            {
              field: 'report_date',
              direction: 'desc'
            }
          ],
          limit: 2
        }
      };

      Report.query(params).$promise.then(function(reportResponse) {
        console.log('reportResponse.features', reportResponse.features)
        self.other = {
          reports: reportResponse.features
        };
      });
    };

    /**
     * Open Report functionality to the Cotnroller
     */
     self.comment = {
       data: {},
       update: function(comment, state) {
          var comment_ = new Comment({
            body: comment.properties.body,
            report_state: state
          });

          comment_.$update({
            id: comment.id
          }).then(function() {
            $route.reload();
          });
       },
       delete: function(commentId) {
        Comment.delete({
          id: commentId
        }).$promise.then(function() {
          $route.reload();
        });
       },
       close: function(reportId) {

        // Save the Comment
        self.comment.save(reportId, 'closed');

        // Close the Reprot
         Report.close({
          id: reportId,
          state: 'closed'
         }).$promise.then(function() {
           $route.reload();
         });
       },
       open: function(reportId) {

        // Save the Comment
        self.comment.save(reportId, 'open');

        // Close the Reprot
         Report.close({
          id: reportId,
          state: 'open'
         }).$promise.then(function() {
           $route.reload();
         });
       },
       save: function(reportId, state) {

        var comment = new Comment({
          body: self.comment.data.body,
          status: 'public',
          report_id: reportId,
          report_state: (state) ? state : null
        });

        if (self.image) {
          var fileData = new FormData();

          fileData.append('image', self.image);

          Image.upload({}, fileData).$promise.then(function(successResponse) {

            console.log('successResponse', successResponse);

            comment.images = [
              {
                id: successResponse.id
              }
            ];

            comment.$save(function() {
              $route.reload();
            });

          });
        } else {
          comment.$save(function() {
            $route.reload();
          });
        }
       }
      };

     self.delete = function(reportId) {
       Report.delete({
         id: reportId
       }).$promise.then(function() {
         $location.path('/activity/list');
       });
     };

     self.edit = function(reportId) {
       $location.path('/reports/' + reportId + '/edit');
     };

     self.changeFeature = function(feature) {

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

     $scope.$on('leafletDirectiveMap.blur', function() {
       self.map.toggleControls('hide');
       self.map.expanded = false;

       var map_ = document.getElementById('map--wrapper');
       map_.className = 'map--wrapper';

       leafletData.getMap().then(function(map) {
         map.invalidateSize();
       });
     });

     $scope.$on('leafletDirectiveMarker.click', function(event, args) {
       $location.path(self.map.markers[args.modelName].permalink);
     });

   });
