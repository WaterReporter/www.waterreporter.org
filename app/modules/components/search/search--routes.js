'use strict';

/**
 * @ngdoc overview
 * @name
 * @description
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/search', {
        templateUrl: '/modules/components/search/search--view.html',
        controller: 'SearchController',
        controllerAs: 'page',
        reloadOnSearch: true,
        resolve: {
          reports: function($location, $route, Report) {

            //
            // Get all of our existing URL Parameters so that we can
            // modify them to meet our goals
            //
            var search_params = $location.search();

            //
            // Prepare any pre-filters to append to any of our user-defined
            // filters in the browser address bar
            //
            search_params.q = (search_params.q) ? angular.fromJson(search_params.q) : {};

            search_params.q.filters = (search_params.q.filters) ? search_params.q.filters : [];
            search_params.q.order_by = (search_params.q.order_by) ? search_params.q.order_by : [];

            //
            // Ensure that returned Report features are sorted newest first
            //
            search_params.q.order_by.push({
              field: 'report_date',
              direction: 'desc'
            });

            search_params.q.order_by.push({
              field: 'id',
              direction: 'desc'
            });

            //
            // Execute our query so that we can get the Reports back
            //
            return Report.query(search_params);
          },
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
          }
        }
      });
  });
