(function() {

  'use strict';

  /**
   * @ngdoc service
   * @name WaterReporter
   * @description
   * Provides access to the User endpoint of the WaterReporter API
   * Service in the WaterReporter.
   */
  angular.module('WaterReporter')
    .config(function (bugsnagProvider, environment) {

          bugsnagProvider.noConflict();

          bugsnagProvider.apiKey('e939b9b020e19248c0ae0e977cc56e4a');

          bugsnagProvider.releaseStage(environment.name);

          bugsnagProvider.appVersion('v1.1.24');

          bugsnagProvider.beforeNotify(function ($log) {
            return function (error, metaData) {

              $log.debug(error.name, metaData);

              return true;

            };
          });
      });

}());
