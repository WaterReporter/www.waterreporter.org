'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the Search endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('Search', function () {
    
    /**
     * Private Functions and Variables for the Search Service
     */


    /**
     * Public Functions and Variables for the Search Service
     */
     return {
        params: {},
        execute: function() {
         console.log('this.params', this.params);
        }
     };
  });