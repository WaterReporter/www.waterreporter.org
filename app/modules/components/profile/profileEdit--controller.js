(function() {

  'use strict';

  /**
   * @ngdoc function
   * @name
   * @description
   */
  angular.module('WaterReporter')
    .controller('ProfileEditController', function (Account, group, groups, Image, $location, profile, $rootScope, $route, Search, $scope, user, User) {

      var self = this;

      self.image = null;

      self.group = group;

      self.status = {
        saving: {
          action: false,
          message: null
        },
        image: {
          remove: false
        }
      };

      //
      // Load main Profile data
      //
      profile.$promise.then(function(profileResponse) {

        self.profile = profileResponse;

        if (self.profile.properties.telephone && self.profile.properties.telephone.length === 0) {
          self.profile.properties.telephone = [{}];
        }
        if (self.profile.properties.organization && self.profile.properties.organization.length === 0) {
          self.profile.properties.organization = [{}];
        }

        self.profile.properties.groups = groups;
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
      } else {
        $location.path('/profiles/' + $route.current.params.userId);
      }

      self.processGroups = function(list) {

        var _return = [];

        angular.forEach(list, function(item) {

          var group;

          if (item && item.properties) {
            group = {
              organization_id: item.properties.organization_id,
              joined_on: item.properties.joined_on
            };
          } else if (item && item.organization_id) {
            group = {
              organization_id: item.organization_id,
              joined_on: item.joined_on
            };
          }

          if (item && item.properties) {
            group.id = item.id;
          }

          _return.push(group);
        });

        return _return;
      };

      self.save = function() {

        if (self.profile.properties.images) {
          self.profile.properties.images = self.profile.properties.images.properties;
        }

        self.status.saving.action = true;

        var profile_ = new User({
          id: self.profile.id,
          first_name: self.profile.properties.first_name,
          last_name: self.profile.properties.last_name,
          public_email: self.profile.properties.public_email,
          description: self.profile.properties.description,
          title: self.profile.properties.title,
          organization_name: self.profile.properties.organization_name,
          groups: self.processGroups(self.profile.properties.groups.features),
          telephone: [{
            number: (self.profile.properties.telephone && self.profile.properties.telephone.length && self.profile.properties.telephone[0].properties !== undefined && self.profile.properties.telephone[0].properties.number !== undefined) ? self.profile.properties.telephone[0].properties.number : null
          }],
          images: self.profile.properties.images
        });

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

             profile_.$update(function(userResponse) {
               $rootScope.user = userResponse;
               $location.path('/profiles/' + $rootScope.user.id);
             });

           });
        } else {

           //
           // If the image is being removed ... then remove it ... if not ... leave it alone.
           //
           if (self.status.image.remove) {
             profile_.images = [];
           } else {
             delete profile_.images;
           }

           profile_.$update(function(userResponse) {
             $rootScope.user = userResponse;
             $location.path('/profiles/' + $rootScope.user.id);
           });
        }
     };

     self.removeImage = function() {
       self.profile.properties.images = [];
       self.status.image.remove = true;
     };


     //
     // Empty Groups object
     //
     // We need to have an empty geocode object so that we can fill it in later
     // in the address geocoding process. This allows us to pass the results along
     // to the Form Submit function we have in place below.
     //
     self.groups = {};

     //
     // When the user has selected a response, we need to perform a few extra
     // tasks so that our scope is updated properly.
     //
     $scope.$watch(angular.bind(this, function() {
       return this.groups.response;
     }), function (response) {

       //
       // Only execute the following block of code if the user has geocoded an
       // address. This block of code expects this to be a single feature from a
       // Carmen GeoJSON object.
       //
       // @see https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
       //
       if (response) {

         //
         // When the user clicks on a selection from the drop down, we should
         // add that selection to the list of groups.
         //
         // The user must save the profile page in order for the group
         // relationships to take affect.
         //
         self.profile.properties.groups.features.push({
           properties: {
             organization_id: response.id,
             joined_on: new Date(),
             organization: response
           }
         });

         self.groups = {
           query: null,
           response: null
         };
       }

     });


    });

}());
