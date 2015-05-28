'use strict';

describe('Controller: MapController', function () {

  // load the controller's module
  beforeEach(module('WaterReporter.map'));

  var MapController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MapController = $controller('MapController', {
      $scope: scope
    });
  }));

});