'use strict';

/**
 * @ngdoc function
 * @name
 * @description
 */
angular.module('WaterReporter')
  .controller('ProfileEditController', function (Account, profile, Report, $rootScope, $route, Search, $scope, user) {

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

      self.profile = profileResponse.properties;

      if (self.profile.telephone.length === 0) {
        self.profile.telephone = [{}];
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
          isProfile: ($rootScope.user.id === parseInt($route.current.params.userId)) ? true : false,
          isCurrentUser: ($rootScope.user.id === parseInt($route.current.params.userId)) ? true : false
        };

      });
    }

  });
