'use strict';

describe('Controller: SingleReportController', function () {

  // load the controller's module
  beforeEach(module('WaterReporter.report'));

  var SingleReportController,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SingleReportController = $controller('SingleReportController', {
      $scope: scope,
      $rootScope: $rootScope
    });
  }));

});