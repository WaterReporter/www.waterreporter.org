'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the Search endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('Search', function ($location, $route) {
    
    /**
     * Private Functions and Variables for the Search Service
     */
     var _Search = {};


    /**
     * Public Functions and Variables for the Search Service
     */
     var Search = {
        resource: {},
        model: {},
        data: {},
        defaults: function() {

          var q = ($location.search() && $location.search().q) ? angular.fromJson($location.search().q): [],
              params = {};

          //
          // If no q.filters are present in the browser's address bar, then we
          // need to exit now and simply return an empty array.
          //
          if (!q.filters || !q.filters.length) {
            return params;
          }

          //
          // However, if there are available q.filters, we need to process those
          // and get those values autopopulated in the view so the user isn't
          // confused by the empty fields with filtered results
          //
          angular.forEach(q.filters, function(filter) {

            //
            // Build the value for the filter
            //
            if (filter.op === 'ilike') {
              //
              // With iLike we use a % at the beginning and end of the string
              // so that the data base knows where to start and end looking
              // for the user defined string.
              //
              // When the user reloads the page we need to make sure that those
              // %'s are automatically removed from the string so as not to
              // confuse the user.
              //
              params[filter.name] = filter.val.slice(1,-1);
            }
            else {
              params[filter.name] = filter.val;
            }

          });

          return params;
       },
       params: {}, // On initial page load, load in our defaults from the address bar
       paginate: function(pageNumber) {
        var params = $location.search();

        if (angular.isObject(params.q)) {
          $location.search('q', JSON.stringify(params.q));
        }

        $location.search('page', pageNumber);
        $route.reload();
      },
      autoload: function() {
        this.execute(true);
       },
       hashtag: function(tag, field) {
          this.params[field] = tag;
          this.execute();
       },
       clear: function() {
        $location.search('');
        $route.reload();
       },
       execute: function(append) {

          var service = this,
              params = service.params,
              q = {
                filters: [],
                order_by: [{
                  field: 'report_date',
                  direction: 'desc'
                }]
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
          // Finally, use the resource to load the new Features based on the
          // user-defined query input.
          //
          service.resource.query($location.search()).$promise.then(function(response) {
            service.data = (append) ? service.data.features+=response.features : response;
          });
        }
     };

     return Search;
  });