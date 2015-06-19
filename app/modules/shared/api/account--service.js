'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the User endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('Account', function (ipCookie, User) {

    /**
     * PRVIATE
     *
     */
    var _getUser = function() {
      //
      // Make sure we take all of the 'User' information and save it to
      // the Account object so that we can reuse it throughout the system
      //
      User.me(function(user_response) {
        return user_response;
      }, function(error_response) {
        console.error('Account._getUser()', error_response);
      });
    };


    /**
     * PUBLIC
     *
     */
    var Account = _getUser();
    
    return Account;
  });