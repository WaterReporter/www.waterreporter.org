(function() {

  'use strict';

  /**
   * @ngdoc function
   * @name WaterReporter.submit.controller:OrganizationProfileController
   * @description
   */
  angular.module('WaterReporter')
    .controller('OrganizationProfileController', function (Account, Map, mapbox, members, organization, Report, reports, $rootScope, $route, Search, user) {

      var self = this;

      self.organization = organization;

      self.members = members;


      /**
       * Setup the User object so that we can determine the type of authentication,
       * user permissions, and if the current page is the profile page.
       *
       * @param (object) A User $promise
       */
      self.permissions = {};

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

      this.search.params = {
        q: {
          filters: [
            {
              name: 'owner_id',
              op: 'eq',
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

      this.search.resource = Report;

      this.search.data = reports;


      /**
       * Map
       *
       * @param (obj) map
       *     Provides the controller access to the Map Service
       *
       * @return (obj) this
       */
       this.map = Map;

       this.map.markers = null;

       L.Icon.Default.imagePath = '/images';


    });

}());
