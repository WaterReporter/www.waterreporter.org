'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.profile.config:profile-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the profile page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/profiles/:userId', {
        templateUrl: '/modules/components/profile/profile--view.html',
        controller: 'ProfileController',
        controllerAs: 'page',
        resolve: {
          user: function(Account) {
            return Account.getUser();
          },
          profile: function($route, User) {
            return User.get({
              id: $route.current.params.userId
            });
          },
          organizations: function($route, User) {
            return User.getOrganizations({
              id: $route.current.params.userId
            });
          },
          submissions: function($location, $route, Report) {

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
            search_params.q.filters.push({
              name: 'owner_id',
              op: 'eq',
              val: $route.current.params.userId
            });

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
          closures: function(Report, $route) {

            var search_params = {
              q: {
                filters: [
                  {
                    name: 'closed_by__id',
                    op: 'has',
                    val: $route.current.params.userId
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
            };

            return Report.query(search_params);
          }
        }
      })
      .when('/profiles/:userId/actions', {
        templateUrl: '/modules/components/profile/profileActions--view.html',
        controller: 'ProfileActionsController',
        controllerAs: 'page',
        resolve: {
          user: function(Account) {
            return Account.getUser();
          },
          profile: function($route, User) {
            return User.get({
              id: $route.current.params.userId
            });
          },
          organizations: function($route, User) {
            return User.getOrganizations({
              id: $route.current.params.userId
            });
          },
          submissions: function($location, $route, Report) {

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
            search_params.q.filters.push({
              name: 'owner_id',
              op: 'eq',
              val: $route.current.params.userId
            });

            //
            // Execute our query so that we can get the Reports back
            //
            return Report.query(search_params);
          },
          closures: function(Report, $route) {

            var search_params = {
              q: {
                filters: [
                  {
                    name: 'closed_by__id',
                    op: 'has',
                    val: $route.current.params.userId
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
            };

            return Report.query(search_params);
          }
        }
      })
      .when('/profiles/:userId/reports', {
        templateUrl: '/modules/components/profile/profileReports--view.html',
        controller: 'ProfileReportsController',
        controllerAs: 'page',
        resolve: {
          user: function(Account) {
            return Account.getUser();
          },
          profile: function($route, User) {
            return User.get({
              id: $route.current.params.userId
            });
          },
          organizations: function($route, User) {
            return User.getOrganizations({
              id: $route.current.params.userId
            });
          },
          submissions: function($location, $route, Report) {

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
            search_params.q.filters.push({
              name: 'owner_id',
              op: 'eq',
              val: $route.current.params.userId
            });

            //
            // Execute our query so that we can get the Reports back
            //
            return Report.query(search_params);
          },
          closures: function(Report, $route) {

            var search_params = {
              q: {
                filters: [
                  {
                    name: 'closed_by__id',
                    op: 'has',
                    val: $route.current.params.userId
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
            };

            return Report.query(search_params);
          }
        }
      })
      .when('/profiles/:userId/edit', {
        templateUrl: '/modules/components/profile/profileEdit--view.html',
        controller: 'ProfileEditController',
        controllerAs: 'page',
        resolve: {
          user: function(Account) {
            return Account.getUser();
          },
          profile: function($route, User) {
            return User.get({
              id: $route.current.params.userId
            });
          },
          reports: function(Report) {
            //
            // Execute our query so that we can get the Reports back
            //
            return Report.query({
              q: {}
            });
          }
        }
      });
  });
