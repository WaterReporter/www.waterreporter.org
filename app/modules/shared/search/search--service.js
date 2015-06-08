'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the Search endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('Search', function ($location) {
    
    /**
     * Private Functions and Variables for the Search Service
     */
     var _Search = {
       filter: {
        build: function() {

        }
       }
     };


    /**
     * Public Functions and Variables for the Search Service
     */
     var Search = {
        resource: {},
        model: {},
        data: {},
        execute: function() {

          var service = this,
              params = service.params,
              q = {
                filters: []
              };

          //
          // Loop over each of the parameters that the search allows the user
          // to fill in and for each one, use the provided model to build out
          // a proper Filters array
          //
          angular.forEach(params, function(field_value, field_name) {

            //
            // Get the information for the model
            //
            var filter = service.model[field_name];

            //
            // Build the value for the filter
            //
            if (filter.op === 'ilike') {
              filter.val = '%' + field_value + '%';
            }

            //
            // Pass off the completed filter to the `q` parameter for
            // processing
            //
            q.filters.push(filter);

          });

          //
          // With a completed `q` parameter, we can now pass it back to the
          // browser's address bar
          //
          $location.search({
            'q': angular.toJson(q)
          });

          //
          // Finally, 
          //
          console.log('$resource', service.resource);
          service.resource.query($location.search()).$promise.then(function(response) {
            console.log('response', response);
            service.data = response;
          });
        }
     };

     return Search;
  });