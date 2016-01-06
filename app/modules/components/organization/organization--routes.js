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
      })
      .when('/organizations/:organizationId', {
        templateUrl: '/modules/components/organization/views/organizationProfile--view.html',
        controller: 'OrganizationProfileController',
        controllerAs: 'page',
        resolve: {
          closures: function($route, Report) {
            return Report.query({
              q: {
                filters: [
                  {
                    name: 'groups__id',
                    op: 'any',
                    val: $route.current.params.organizationId
                  },
                  {
                    name: 'state',
                    op: 'eq',
                    val: 'closed'
                  }
                ],
                order_by: [
                  {
                    field: 'report_date',
                    direction: 'desc'
                  },
                  {
                    field: 'id',
                    direction: 'desc'
                  }
                ]
              }
            });
          },
          organization: function($route, Organization) {
            return Organization.get({
              id: $route.current.params.organizationId
            });
          },
          reports: function($route, Organization) {
            return Organization.reports({
              id: $route.current.params.organizationId
            });
          },
          members: function($route, Organization) {
            return Organization.members({
              id: $route.current.params.organizationId
            });
          },
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
          }
        }
      })
      .when('/organizations/:organizationId/actions', {
        templateUrl: '/modules/components/organization/views/organizationActions--view.html',
        controller: 'OrganizationActionsController',
        controllerAs: 'page',
        resolve: {
          closures: function($route, Report) {
            return Report.query({
              q: {
                filters: [
                  {
                    name: 'groups__id',
                    op: 'any',
                    val: $route.current.params.organizationId
                  },
                  {
                    name: 'state',
                    op: 'eq',
                    val: 'closed'
                  }
                ],
                order_by: [
                  {
                    field: 'report_date',
                    direction: 'desc'
                  },
                  {
                    field: 'id',
                    direction: 'desc'
                  }
                ]
              }
            });
          },
          organization: function($route, Organization) {
            return Organization.get({
              id: $route.current.params.organizationId
            });
          },
          reports: function($route, Organization) {
            return Organization.reports({
              id: $route.current.params.organizationId
            });
          },
          members: function($route, Organization) {
            return Organization.members({
              id: $route.current.params.organizationId
            });
          },
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
          }
        }
      })
      .when('/organizations/:organizationId/edit', {
        templateUrl: '/modules/components/organization/views/organizationEdit--view.html',
        controller: 'OrganizationEditController',
        controllerAs: 'page',
        resolve: {
          organization: function($route, Organization) {
            return Organization.get({
              id: $route.current.params.organizationId
            });
          },
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
          }
        }
      });
  });
