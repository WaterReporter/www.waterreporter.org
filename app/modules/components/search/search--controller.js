'use strict';

/**
 * @ngdoc function
 * @name
 * @description
 */
angular.module('WaterReporter')
  .controller('SearchController', function (Account, Exporter, $location, Report, reports, $rootScope, Search, user) {

    var self = this;

    self.permissions = {};

    /**
     * Setup search capabilities for the Report Activity Feed
     *
     * @data this.search
     *    loads the Search Service into our page scope
     * @data this.search.params
     *    loads the default url parameters into the page fields
     * @data this.search.model
     *    tells the Search Service what the data model for this particular search looks like
     * @data this.search.resource
     *    tells the Search Service what resource to perform the search with
     * @data this.search.data
     *    retains and updates based on the features returned from the user-defined query
     *
     */
    this.search = Search;

    this.search.hidden = true;

    this.search.model = {
      report_description: {
        name: 'report_description',
        op: 'ilike',
        val: ''
      }
    };

    var defaults = this.search.defaults();

    this.search.params = (defaults) ? defaults : {};

    this.search.resource = Report;

    this.search.data = reports;

    this.search.options = [];

    //
    // Load an additional 25 reports and append them to the existing search
    //
    self.page = 1;

    self.more = function() {
      console.log(self.search.data.features.length, self.search.data.properties.num_results, (self.search.data.features.length < self.search.data.properties.num_results));
      if (self.search.data.features.length < self.search.data.properties.num_results) {

        //
        // Increment the page to be loaded by 1
        //
        self.page++;

        //
        // Get all of our existing URL Parameters so that we can
        // modify them to meet our goals
        //
        var search_params = $location.search();

        //
        // Prepare any pre-filters to append to any of our user-defined
        // filters in the browser address bar
        //
        search_params.q = (search_params.q) ? angular.fromJson(search_params.q) : {};

        search_params.q.filters = (search_params.q.filters) ? search_params.q.filters : [];
        search_params.q.order_by = (search_params.q.order_by) ? search_params.q.order_by : [];

        //
        // Ensure that returned Report features are sorted newest first
        //
        search_params.q.order_by.push({
          field: 'report_date',
          direction: 'desc'
        });

        search_params.page = self.page;

        //
        // Execute our query so that we can get the Reports back
        //
        Report.query(search_params).$promise.then(function(reportsResponse) {

          var original = self.search.data.features,
              newResults = reportsResponse.features;
          self.search.data.features = original.concat(newResults);
        });
      }
    };

    self.displayTerm = null;

    self.download = {
      processing: false,
      format: null,
      csv: function() {

        self.download.processing = true;
        self.download.format = 'CSV';

        /**
         * In order to download all the results we need to make a second request
         * to the API.
         */
        var search_params = $location.search();

        Report.query({
          q: search_params.q,
          results_per_page: self.search.data.properties.num_results
        }).$promise.then(function(reportResponse) {
          Exporter.geojsonToCsv(reportResponse);
          self.download.processing = false;
        });
      },
      geojson: function() {

        self.download.processing = true;
        self.download.format = 'GeoJSON';

        /**
         * In order to download all the results we need to make a second request
         * to the API.
         */
        var search_params = $location.search();

        Report.query({
          q: search_params.q,
          results_per_page: self.search.data.properties.num_results
        }).$promise.then(function(reportResponse) {
          Exporter.geojson(reportResponse);
          self.download.processing = false;
        });
      }
    };

    self.changeSearchType = function() {
      (!self.search.params.territory) ? delete self.search.params.territory : self.search.model.territory.val = self.search.params.territory;
    };

    //
    // This is the first page the authneticated user will see. We need to make
    // sure that their user information is ready to use. Make sure the
    // Account.userObject contains the appropriate information.
    //
    if (Account.userObject && user) {
      user.$promise.then(function(userResponse) {
        $rootScope.user = Account.userObject = userResponse;

        if (userResponse.properties.classifications.length) {

          var hucType = user.properties.classifications[0].properties.digits,
              fieldName = 'huc_' + hucType + '_name',
              prefilter = $location.search().prefilter,
              territory = userResponse.properties.classifications[0].properties.name;

          //
          // Add an additional search filter option
          //

          if (self.search.model.territory === undefined) {
            self.search.model.territory = {
              name: 'territory__' + fieldName,
              op: 'has',
              val: (self.search.params.territory) ? self.search.params.territory : null
            };
          }

          self.search.options.push({
            name: 'My Watershed',
            val: territory
          });

        }

        self.permissions = {
          isLoggedIn: Account.hasToken(),
          isAdmin: Account.hasRole('admin'),
          isProfile: false,
          hasWatershed: null
        };
      });
    }

  });
