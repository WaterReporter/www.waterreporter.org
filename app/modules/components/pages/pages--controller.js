'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.home.controller:HomeController
 * @description
 * # HomeController
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('PageController', function (Account, $location, Notifications, $rootScope, user) {

    var self = this;

    //
    // This is the first page the authneticated user will see. We need to make
    // sure that their user information is ready to use. Make sure the
    // Account.userObject contains the appropriate information.
    //
    if (Account.userObject && user) {
      user.$promise.then(function(userResponse) {
        $rootScope.user = Account.userObject = userResponse;

        if (!$rootScope.user.properties.first_name || !$rootScope.user.properties.last_name) {
          $rootScope.notifications.warning('Hey!', 'Please <a href="/profiles/' + $rootScope.user.id + '/edit">complete your profile</a> by sharing your name and a photo');
        }
      });
    }

  });
