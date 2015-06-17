'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.profile.controller:ProfileController
 * @description
 * # ProfileController
 * Controller of the WaterReporter
 */
angular.module('WaterReporter')
  .controller('ProfileController', function (closures, organizations, profile, reports) {
    this.data = profile;
    this.organizations = organizations;

    this.reports = reports;

    console.log('profile', profile, organizations, reports);
  });