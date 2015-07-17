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
      .when('/activity', {
        templateUrl: '/modules/components/activity/activity--view.html',
        controller: 'ActivityController',
        controllerAs: 'activity',
        reloadOnSearch: false,
        resolve: {
          features: function(Report) {
            //
            // Execute our query so that we can get the Reports back
            //
            return Report.query({
              q: {
                filters: [
                  {
                    name: 'is_featured',
                    op: 'eq',
                    val: 'true'
                  }
                ],
                order_by: [
                  {
                    field: 'report_date',
                    direction: 'desc'
                  }
                ]
              }
            });
          },
          reports: function(Report) {
            //
            // Execute our query so that we can get the Reports back
            //
            return Report.query({
              q: {
                order_by: [
                  {
                    field: 'report_date',
                    direction: 'desc'
                  }
                ]
              }
            });
          },
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
          }
        }
      });
  });
