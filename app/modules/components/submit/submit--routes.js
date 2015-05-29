'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.submit.config:submitReport-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the submit report page of the application.
 */

angular.module('WaterReporter.submit')
  .config(function ($stateProvider) {
    
    $stateProvider
      .state('submit', {
        url: '/submit',
        views: {
          'SiteHeader@': {
            templateUrl: '/modules/shared/views/header--view.html',
          },
          'SiteContent@': {
            templateUrl: '/modules/components/submit/submit--view.html',
            controller: 'SubmitController',
            controllerAs: 'submit'
          },
          'SiteFooter@': {
            templateUrl: '/modules/shared/views/footer--view.html',
          }
        }
      });
      
  });