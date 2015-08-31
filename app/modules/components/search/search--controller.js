'use strict';

/**
 * @ngdoc function
 * @name
 * @description
 */
angular.module('WaterReporter')
  .controller('SearchController', function (Account, Exporter, $location, Notifications, Report, reports, $rootScope, Search, user) {

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

    this.search.model = {
      report_description: {
        name: 'report_description',
        op: 'ilike',
        val: ''
      }
    };

    //
    // Make sure our defaults are setup and accomodate the searcm params object
    //
    var defaults = this.search.defaults();

    this.search.params = (defaults) ? defaults : {};

    angular.forEach(defaults, function(_default, index) {
      if (index.indexOf('territory__') === 0) {
        self.search.params.territory = _default;
      }
    });

    this.search.resource = Report;

    this.search.page = 1;

    this.search.data = reports;

    this.search.options = [];

    //
    // Make sure we're displaying the search term to the user
    //
    if (this.search.params.report_description) {
      this.search.term = this.search.params.report_description;
    }

    //
    // Make sure we're loading hashtags
    //
    if ($location.search().tag) {
      this.search.params.report_description = $location.search().tag;
      this.search.execute();
    }

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
      if (!self.search.params.territory) {
        delete self.search.params.territory;
      } else {
        self.search.model.territory.val = self.search.params.territory;
      }
    };

    //
    // This is the first page the authneticated user will see. We need to make
    // sure that their user information is ready to use. Make sure the
    // Account.userObject contains the appropriate information.
    //
    if (Account.userObject && user) {
      user.$promise.then(function(userResponse) {
        $rootScope.user = Account.userObject = userResponse;

        if (!$rootScope.user.properties.first_name || !$rootScope.user.properties.last_name) {
          $rootScope.notifications.warning('Hey!', 'Please <a href="/profiles/' + $rootScope.user.id + '/edit">complete your profile</a> by sharing your name and a photo');
        }

        if (userResponse.properties.classifications.length) {

          var hucType = user.properties.classifications[0].properties.digits,
              fieldName = 'huc_' + hucType + '_name',
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
