'use strict';

describe('Controller: SingleReportController', function () {

  // load the controller's module
  beforeEach(module('wr.singleReport'));

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

  it('should attach a list of awesomeThings to the scope', function () {
    // expect(scope.awesomeThings.length).toBe(3);
    expect().toBe();
  });
});