'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.activity.config:activity-routes
 * @description
 *     Routes for the states applying to the activity feed page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/organizations', {
        templateUrl: '/modules/components/organization/views/organizationList--view.html',
        controller: 'OrganizationListController',
        controllerAs: 'page',
        reloadOnSearch: false,
        resolve: {
          organizations: function(Organization) {
            //
            // Execute our query so that we can get the Reports back
            //
            return Organization.query({
              q: {
                order_by: [
                  {
                    field: 'name',
                    direction: 'asc'
                  }
                ]
              },
              page: 1
            });
          },
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
          }
        }
      });
  });
