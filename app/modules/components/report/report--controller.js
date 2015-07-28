'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.report.controller:SingleReportController
 * @description
 *     Display a single report based on the current `id` provided in the URL
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('ReportController', function (Account, comments, Comment, leafletData, Map, mapbox, mapboxGeometry, $location, $rootScope, report, Report, $route, Search, user) {

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

    this.search.model = {
      report_description: {
        name: 'report_description',
        op: 'ilike',
        val: ''
      }
    };

    this.search.resource = Report;

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

    this.map.markers = null;
    this.map.center = null;

    L.Icon.Default.imagePath = '/images';

    report.$promise.then(function(reportResponse) {

      console.log('reportResponse', reportResponse)

      self.report = reportResponse;

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
            longitude: self.report.geometry.geometries[0].coordinates[1],
            latitude: self.report.geometry.geometries[0].coordinates[0]
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

      // leafletData.getMap().then(function() {
      //   $scope.$on('leafletDirectiveMarker.click', function(event, args) {
      //     $location.path(self.map.markers[args.modelName].permalink);
      //   });
      // });

    });

    self.comments = comments;

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
            console.log('comment saved!!!');
            $route.reload();
          });
       },
       delete: function(commentId) {
        Comment.delete({
          id: commentId
        }).$promise.then(function(response) {
          console.log('response', response);
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
         }).$promise.then(function(response) {
           console.log('response', response);
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
         }).$promise.then(function(response) {
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

        comment.$save(function() {
          $route.reload();
        });
       }
      };

     self.delete = function(reportId) {
       Report.delete({
         id: reportId
       }).$promise.then(function(response) {
         $location.path('/activity/list');
       });
     };

     self.changeFeature = function(feature, index) {
       
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

   });
