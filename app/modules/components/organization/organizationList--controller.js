(function() {

  'use strict';

  /**
   * @ngdoc function
   * @name WaterReporter.submit.controller:OrganizationListController
   * @description
   */
  angular.module('WaterReporter')
    .controller('OrganizationListController', function (Account, Organization, organizations, $rootScope, Search, user) {

      var self = this;


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
      self.search = Search;

      self.search.resource = Organization;

      self.search.page = 1;

      self.search.data = organizations;

      self.search.params = {
        q: {
          order_by: [
            {
              field: 'name',
              direction: 'asc'
            }
          ]
        },
        page: 1
      };

    });

}());
