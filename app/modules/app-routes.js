'use strict';

angular.module('waterReporterApp')
  .config(function waterReporterApp ($locationProvider, $urlRouterProvider) {
    //For any unmatched url, redirect to home
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });