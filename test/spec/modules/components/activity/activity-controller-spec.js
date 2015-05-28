'use strict';

describe('Controller: ActivityController', function () {

  // load the controller's module
  beforeEach(module('WaterReporter.activity'));

  var ActivityFeedController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivityFeedController = $controller('ActivityController', {
      $scope: scope
    });
  }));

});