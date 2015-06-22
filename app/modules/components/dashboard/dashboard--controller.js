'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.report.controller:SingleReportController
 * @description
 *     Display a single report based on the current `id` provided in the URL
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('DashboardController', function (Account, $location, Report, $rootScope, Search, user) {

    var self = this;

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

    this.search.params = Search.defaults();

    this.search.model = {
      report_description: {
        name: 'report_description',
        op: 'ilike',
        val: ''
      }
    };

    this.search.resource = Report;


    /**
     * Load the dashboard with the appropriate User-specific reports
     */
    self.loadDashboard = function () {

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
      // We need to add the current user's territory to this 
      //

      //
      // Ensure that returned Report features are sorted newest first
      //
      search_params.q.order_by.push({
        field: 'report_date',
        direction: 'desc'
      });

      angular.forEach(Account.userObject.properties.classifications, function(value) {
        var classification = value.properties,
            fieldName = 'territory__huc_' + classification.digits + '_name',
            filter = {
              name: fieldName,
              op: 'has',
              val: classification.name
            };

        search_params.q.filters.push(filter);

        // We need to dyamically define the model for this since the fieldName
        // is variable
        self.search.model[fieldName] = filter;

        // We need to manually add the param to the classifications
        self.search.params[fieldName] = classification.name;
      });

      //
      // Execute our query so that we can get the Reports back
      //
      self.search.data = Report.query(search_params);
    };


    //
    // This is the first page the authneticated user will see. We need to make
    // sure that their user information is ready to use. Make sure the
    // Account.userObject contains the appropriate information.
    //
    if (Account.userObject && !Account.userObject.id) {
      if (user) {
        user.$promise.then(function(userResponse) {
          Account.userObject = userResponse;
            $rootScope.user = Account.userObject;

            $rootScope.isLoggedIn = Account.hasToken();
            $rootScope.isAdmin = Account.hasRole('admin');

            self.loadDashboard();
        });
      }
    }
    else {
      self.loadDashboard();
    }

  });