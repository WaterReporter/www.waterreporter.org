'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.home.controller:HomeController
 * @description
 * # HomeController
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('PageController', function (Account, $location, Report, $rootScope, user) {

    var self = this;

    //
    // This is the first page the authneticated user will see. We need to make
    // sure that their user information is ready to use. Make sure the
    // Account.userObject contains the appropriate information.
    //
    if (Account.userObject && user) {
      user.$promise.then(function(userResponse) {
        $rootScope.user = Account.userObject = userResponse;

        $location.path('/activity');
      });
    }

  });
