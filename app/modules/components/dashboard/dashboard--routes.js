'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.singleReport.config:report-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the single report page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {

    $routeProvider
      .when('/dashboard', {
        templateUrl: '/modules/components/dashboard/dashboard--view.html',
        controller: 'DashboardController',
        controllerAs: 'page',
        reloadOnSearch: false,
        resolve: {
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
          },
          closures: function(Report, $route, ipCookie) {

            var search_params = {
              q: {
                filters: [
                  {
                    name: 'closed_by__id',
                    op: 'has',
                    val: ipCookie('WATERREPORTER_CURRENTUSER')
                  }
                ]
              }
            };

            return Report.query(search_params);
          },
          reports: function($location, $route, Report, ipCookie) {


            //
            // Execute our query so that we can get the Reports back
            //
            return Report.query({
              q: {
                filters: [{
                  name: 'owner_id',
                  op: 'eq',
                  val: ipCookie('WATERREPORTER_CURRENTUSER')
                }],
                order_by: [{
                  field: 'report_date',
                  direction: 'desc'
                }]
              }
            });
          }
        }
      });

  });
