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
     * Public Functions and Variables for the Search Service
     */
     var service;

     var Search = {
        busy: false,
        page: 1,
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

          console.log(params)

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

        var service = this;

        if (service.busy) {
          return;
        }

        service.busy = true;
        service.page++;

        if (service.data && service.page >= service.data.properties.total_pages) {
          return;
        }

        //
        // Load our filters
        //
        this.filters(service.page, 25);

        service.resource.query($location.search()).$promise.then(function(successResponse) {
          service.busy = false;

          var reports = successResponse,
              existing = service.data.features;

          service.data.features = existing.concat(reports.features);
        });

       },
       hashtag: function(tag, field) {
          this.params[field] = tag;
          this.execute();
       },
       filters: function(_page, _results_per_page) {
         service = this;

         var params = service.params,
             q = {
               filters: [],
               order_by: [{
                 field: 'report_date',
                 direction: 'desc'
               }]
             };

         if (_page === -1) {
           $location.search({
             q: angular.toJson(q),
             page: 1
           });

           return;
         }

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
           q: angular.toJson(q),
           page: _page ? _page : 1
         });
       },
       clear: function() {

         // Remove all URL bar parameters
         $location.search('');

         // Clear out our parameter object
         this.params = {};

         // Make sure our filters are empty
         this.filters(-1);

         // Then reload the page
         $route.reload();
       },
       redirect: function() {
         this.filters();
         $location.path('/search');
       },
       execute: function(append) {

          //
          // Load our filters
          //
          this.filters();

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
