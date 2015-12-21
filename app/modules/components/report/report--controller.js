'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.report.controller:SingleReportController
 * @description
 *     Display a single report based on the current `id` provided in the URL
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('ReportController', function (Account, comments, Comment, groups, Image, ipCookie, leafletData, Map, mapbox, mapboxGeometry, $location, Notifications, $rootScope, report, Report, $route, $scope, Search, user) {

    /**
     * Setup variables that are global to this controller
     * 
     * @data this
     * @data this.image
     * @data this.permissions
     */
    var self = this;

    this.image = null;

    this.permissions = {};

    /**
     * Setup the User object so that we can determine the type of authentication,
     * user permissions, and if the current page is the profile page.
     *
     * @param (object) A User $promise
     */
    if (user) {
      user.$promise.then(function(userResponse) {
        $rootScope.user = Account.userObject = userResponse;

        if (!$rootScope.user.properties.first_name || !$rootScope.user.properties.last_name) {
          $rootScope.notifications.warning('Hey!', 'Please <a href="/profiles/' + $rootScope.user.id + '/edit">complete your profile</a> by sharing your name and a photo');
        }

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
    };

    this.map.expanded = false;

    /**
     *  Setup the Report. In Angular it is necessary to return the report
     *  $promise in order to use the report within the controller.
     *  
     *  @data this.report
     *      loads the report object in to the controller scope
     *  @data this.permissions
     *      enahnces the user permission object to show/hide specific items
     *      to the user
     *  @data root.meta
     *      load report specific data into the page meta tags
     *  @data this.map.markers
     *      add this report's information directly to the map
     */
    report.$promise.then(function(reportResponse) {

      self.report = reportResponse;

      self.report.properties.groups = groups;

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

    /**
     * Other Reports:
     * 
     * Other Reports are reports other than the main report that show up on
     * the map once it is navigated.
     * 
     */
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
        self.other = {
          reports: reportResponse.features
        };
      });
    };

    /**
     * Open Report functionality to the Cotnroller
     */
     self.comments = comments;
     
     self.comment = {
       loading: false,
       data: {},
       update: function(comment, state) {

         self.comment.loading = true;

          var comment_ = new Comment({
            body: comment.properties.body,
            report_state: state
          });

          if (self.image) {
            var fileData = new FormData();

            fileData.append('image', self.image);

            Image.upload({}, fileData).$promise.then(function(successResponse) {

              comment_.images = [
                {
                  id: successResponse.id
                }
              ];

              comment_.$update({
                id: comment.id
              }).then(function() {
                $route.reload();
              });

            });
          } else {
            comment_.$update({
              id: comment.id
            }).then(function() {
              $route.reload();
            });
          }
       },
       remove: function(commentId) {
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

         self.comment.loading = true;

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

     /**
      * Report Management Functionality
      * 
      * @func remove
      * @func edit
      */
     self.remove = function(reportId) {
       Report.delete({
         id: reportId
       }).$promise.then(function() {
         $location.path('/activity/list');
       });
     };

     self.edit = function(reportId) {
       $location.path('/reports/' + reportId + '/edit');
     };

     /**
      * 
      */
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

     $scope.$on('leafletDirectiveMarker.click', function(event, args) {
       $location.path(self.map.markers[args.modelName].permalink);
     });

   });
