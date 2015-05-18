'use strict';

describe('Controller: ActivityFeedController', function () {

  // load the controller's module
  beforeEach(module('wr.activityFeed'));

  var ActivityFeedController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivityFeedController = $controller('ActivityFeedController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});