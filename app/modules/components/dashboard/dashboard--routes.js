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
        controllerAs: 'dashboard',
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
            // Get all of our existing URL Parameters so that we can
            // modify them to meet our goals
            //
            var search_params = $location.search();

            //
            // Prepare any pre-filters to append to any of our user-defined
            // filters in the browser address bar
            //
            search_params.q = {};

            search_params.q.filters = [];
            search_params.q.order_by = [];

            //
            // Ensure that returned Report features are sorted newest first
            //
            search_params.q.filters.push({
              name: 'owner_id',
              op: 'eq',
              val: ipCookie('WATERREPORTER_CURRENTUSER')
            });

            search_params.q.order_by.push({
              field: 'report_date',
              direction: 'desc'
            });

            //
            // Execute our query so that we can get the Reports back
            //
            return Report.query(search_params);
          }          
        }
      });

  });