'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.report.controller:SingleReportController
 * @description
 *     Display a single report based on the current `id` provided in the URL
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('ReportController', function (Account, comments, Comment, $location, $rootScope, report, Report, $route, user) {

    var self = this;

    report.$promise.then(function(reportResponse) {
      
      self.data = reportResponse;

      /**
       * Setup Pinterest Rich Pins `<meta>` tags. Each of our Report objects
       * will their own Pinterest Rich Pins page
       *
       * @see https://developers.pinterest.com/rich_pins_place/
       */
      $rootScope.meta = {
        og: {
          site_name: 'WaterReporter',
          title: 'Citizen Water Report in the ' + self.data.properties.territory.properties.huc_8_name + ' Watershed',
          type: 'place',
          description: (self.data.properties.report_description) ? self.data.properties.report_description: 'A report in the ' + self.data.properties.territory.properties.huc_8_name + ' watershed',
          url: 'https://www.waterreporter.org/reports/' + self.data.id
        },
        place: {
          location: {
            longitude: self.data.geometry.geometries[0].coordinates[1],
            latitude: self.data.geometry.geometries[0].coordinates[0]
          }
        }
      };

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
       open: function(reportId, state) {

        // Save the Comment
        self.comment.save(reportId, 'open');

        // Close the Reprot
         Report.close({
          id: reportId,
          state: 'open'
         }).$promise.then(function(response) {
           console.log('response', response);
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
          console.log('comment saved!!!');
          $route.reload();
        });
       }
      };

     self.delete = function(reportId) {
       Report.delete({
         id: reportId        
       }).$promise.then(function(response) {
         console.log('response', response);
         $location.path('/activity/list');
       });
     };

  });