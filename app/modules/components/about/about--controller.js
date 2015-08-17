'use strict';

/**
 * @ngdoc function
 * @name wr.about.controller:AboutController
 * @description
 * # AboutController
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('AboutController', function (Account, $rootScope, user) {

    var self = this;

    /**
     * This is the first page the authneticated user will see. We need to make
     * sure that their user information is ready to use. Make sure the
     * Account.userObject contains the appropriate information.
     */
    if (Account.userObject && !Account.userObject.id) {
      if (user) {
        user.$promise.then(function(userResponse) {
          $rootScope.user = Account.userObject = userResponse;

          self.permissions.isLoggedIn = Account.hasToken();
          self.permissions.isAdmin = Account.hasRole('admin');
          self.permissions.isProfile = false;
        });
      }
    }

  });
