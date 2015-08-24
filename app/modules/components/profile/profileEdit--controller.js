'use strict';

/**
 * @ngdoc function
 * @name
 * @description
 */
angular.module('WaterReporter')
  .controller('ProfileEditController', function (Account, Image, profile, Report, $rootScope, $route, Search, $scope, user, User) {

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
    self.search = Search;

    self.search.model = {
      report_description: {
        name: 'report_description',
        op: 'ilike',
        val: ''
      }
    };

    self.search.resource = Report;

    //
    // Load main Profile data
    //
    profile.$promise.then(function(profileResponse) {

      self.profile = profileResponse;

      if (self.profile.properties.telephone.length === 0) {
        self.profile.properties.telephone = [{}];
      }
      if (self.profile.properties.organization.length === 0) {
        self.profile.properties.organization = [{}];
      }
    });

    //
    // This is the first page the authneticated user will see. We need to make
    // sure that their user information is ready to use. Make sure the
    // Account.userObject contains the appropriate information.
    //
    if (Account.userObject && user) {
      user.$promise.then(function(userResponse) {
        $rootScope.user = Account.userObject = userResponse;

        self.permissions = {
          isLoggedIn: Account.hasToken(),
          isAdmin: Account.hasRole('admin'),
          isProfile: false,
          isCurrentUser: false
        };

      });
    }

    self.save = function() {

      self.profile.properties.images = self.profile.properties.images.properties;

      var profile_ = new User({
        id: self.profile.id,
        first_name: self.profile.properties.first_name,
        last_name: self.profile.properties.last_name,
        email: self.profile.properties.email,
        description: self.profile.properties.description,
        title: self.profile.properties.title,
        organization_name: self.profile.properties.organization_name,
        telephone: [{
          number: self.profile.properties.telephone[0].properties.number
        }],
        images: self.profile.properties.images
      });

      if (!self.profile.properties.organization[0].properties.name) {
        profile_.organization = [];
      } else if (self.profile.properties.organization.length && self.profile.properties.organization[0].properties.id) {
        profile_.organization = [
          {
            id: self.profile.properties.organization[0].properties.id,
            name: self.profile.properties.organization[0].properties.name
          }
        ];
      } else if (self.profile.properties.organization.length && self.profile.properties.organization[0].properties.name) {
        profile_.organization = [
          {
            name: self.profile.properties.organization[0].properties.name
          }
        ];
      }

      if (self.image) {
         var fileData = new FormData();

         fileData.append('image', self.image);

         Image.upload({}, fileData).$promise.then(function(successResponse) {

           console.log('successResponse', successResponse);

           profile_.images = [
             {
               id: successResponse.id
             }
           ];

           profile_.picture = successResponse.thumbnail;

           profile_.$update(function() {
             $route.reload();
           });

         });
      } else {
         profile_.$update(function() {
           $route.reload();
         });
      }
   };

   self.removeImage = function(imageId) {
    self.profile.properties.images= [];
   };

  });
