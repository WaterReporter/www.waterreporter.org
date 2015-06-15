'use strict';

/**
 * @ngdoc overview
 * @name wr.map.config:map-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the map page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/map', {
        redirectTo: '/activity/map'
      })
      .when('/activity/map', {
        templateUrl: '/modules/components/map/map--view.html',
        controller: 'MapController',
        controllerAs: 'activity',
        reloadOnSearch: false,
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

            //
            // Execute our query so that we can get the Reports back
            //
            return Report.query(search_params);
          }
        }
      });
  });