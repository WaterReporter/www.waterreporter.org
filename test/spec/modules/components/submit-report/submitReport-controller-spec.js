'use strict';

describe('Controller: SubmitReportController', function () {

  // load the controller's module
  beforeEach(module('WaterReporter.submitReport'));

  var SubmitReportController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SubmitReportController = $controller('SubmitReportController', {
      $scope: scope
    });
  }));

});