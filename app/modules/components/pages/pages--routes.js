'use strict';

/**
 * @ngdoc overview
 * @name wr.home.config:home-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the home page of the application.
 */
angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/modules/components/pages/home--view.html',
        controller: 'PageController',
        controllerAs: 'page',
        resolve: {
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
          }
        }
      })
      .when('/terms', {
        templateUrl: '/modules/components/pages/terms--view.html',
        controller: 'PageController',
        controllerAs: 'page',
        resolve: {
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
          }
        }
      })
      .when('/about', {
        templateUrl: '/modules/components/pages/about--view.html',
        controller: 'PageController',
        controllerAs: 'page',
        resolve: {
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
          }
        }
      });

  });
