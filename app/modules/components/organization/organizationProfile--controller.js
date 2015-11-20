(function() {

  'use strict';

  /**
   * @ngdoc function
   * @name WaterReporter.submit.controller:OrganizationProfileController
   * @description
   */
  angular.module('WaterReporter')
    .controller('OrganizationProfileController', function (Account, organization, Organization, $rootScope, user) {

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

    });

}());
