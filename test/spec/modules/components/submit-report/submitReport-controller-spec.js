'use strict';

describe('Controller: SubmitReportController', function () {

  // load the controller's module
  beforeEach(module('wr.submitReport'));

  var SubmitReportController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SubmitReportController = $controller('SubmitReportController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});