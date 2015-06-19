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

    var Account = {
      userObject: {}
    };

    Account.getUser = function( ) {

      var userId = ipCookie('WATERREPORTER_CURRENTUSER'),
          $promise = User.get({
            id: userId
          });

      return $promise;
    };

    Account.setUserId = function() {
      var $promise = User.me(function(accountResponse) {

        ipCookie('WATERREPORTER_CURRENTUSER', accountResponse.id, {
          path: '/',
          expires: 2
        });
        
        return accountResponse.id;
      });

      return $promise;
    };
    
    return Account;
  });