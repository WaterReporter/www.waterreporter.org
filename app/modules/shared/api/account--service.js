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

    Account.getUser = function() {

      var userId = ipCookie('WATERREPORTER_CURRENTUSER');

      if (!userId) {
        return false;
      }

      var $promise = User.get({
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

    Account.hasToken = function() {
      if (ipCookie('WATERREPORTER_CURRENTUSER') && ipCookie('WATERREPORTER_SESSION')) {
        return true;
      }

      return false;
    };

    Account.hasRole = function(roleNeeded) {

      var roles = this.userObject.properties.roles;

      if (!roles) {
        return false;
      }

      for (var index = 0; index < roles.length; index++) {
        if (roleNeeded === roles[index].properties.name) {
          return true;
        }
      }

      return false;
    };

    return Account;
  });
