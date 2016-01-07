(function() {

  'use strict';

  /**
   * @ngdoc function
   * @name WaterReporter.submit.controller:OrganizationEditController
   * @description
   */
  angular.module('WaterReporter')
    .controller('OrganizationEditController', function (Account, Image, $location, members, organization, Organization, $rootScope, $route, $scope, user) {

      var self = this;

      self.organization = organization;

      self.members = members;

      self.image = null;

      self.status = {
        saving: {
          action: false,
          message: null
        },
        image: {
          remove: false
        }
      };
      

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
       * Save
       *
       *
       */
      self.save = function() {

        if (self.organization.properties.images) {
          self.organization.properties.images = self.profile.properties.images.properties;
        }

        self.status.saving.action = true;

        var organizationProfile = new Organization({
          id: self.organization.id,
          name: self.organization.properties.name,
          email: self.organization.properties.email,
          website: self.organization.properties.website,
          description: self.organization.properties.description,
          images: self.organization.properties.images
        });

        if (self.image) {
           var fileData = new FormData();

           fileData.append('image', self.image);

           Image.upload({}, fileData).$promise.then(function(successResponse) {

             organizationProfile.images = [
               {
                 id: successResponse.id
               }
             ];

             organizationProfile.picture = successResponse.thumbnail;

             organizationProfile.$update(function(userResponse) {
               $rootScope.user = userResponse;
               $location.path('/organizations/' + self.organization.id);
             });

           });
        } else {

           //
           // If the image is being removed ... then remove it ... if not ... leave it alone.
           //
           if (self.status.image.remove) {
             organizationProfile.images = [];
           } else {
             delete organizationProfile.images;
           }

           organizationProfile.$update(function(userResponse) {
             $rootScope.user = userResponse;
             $location.path('/organizations/' + self.organization.id);
           });
        }
     };

    });

}());
