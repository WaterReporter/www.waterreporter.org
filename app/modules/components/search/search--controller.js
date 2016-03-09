'use strict';

/**
 * @ngdoc function
 * @name
 * @description
 */
angular.module('WaterReporter')
  .controller('SearchController', function (Account, Exporter, $location, Notifications, Report, reports, $rootScope, $route, Search, user, User) {

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

    console.log('this.search.params', this.search.params);

    angular.forEach(defaults, function(_default, index) {
      if (index.indexOf('territory__') === 0) {
        self.search.params.territory = _default;
      } else if (index.indexOf('groups') === 0) {
        self.search.params.groups = _default;
      }
    });

    this.search.resource = Report;

    this.search.page = 1;

    this.search.data = reports;

    this.search.options = {
      territory: [],
      groups: []
    };

    this.myWatersheds = {};
    this.myGroups = {};

    //
    // Make sure we're displaying thessh  search term to the user
    //

    if (this.search.params.report_description) {
      this.search.term = this.search.params.report_description;
    } else {
       this.search.term = null;
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

    self.changeTerritorySearchType = function() {

      console.log('CHANGING TO', self.search.params.territory, self.myWatersheds[self.search.params.territory]);

      if (!self.search.params.territory) {
        delete self.search.params.territory;
      } else {
        self.search.model.territory = self.myWatersheds[self.search.params.territory].model;
      }
    };

    self.changeGroupSearchType = function() {

      console.log('CHANGING TO', self.search.params.groups, self.myGroups[self.search.params.groups]);

      if (!self.search.params.groups) {
        delete self.search.params.groups;
      } else {
        self.search.model.groups = self.myGroups[self.search.params.groups].model;
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

        console.log('userResponse', userResponse)

        if (userResponse.properties.classifications.length) {

          angular.forEach(userResponse.properties.classifications, function(territory) {

            var hucType = territory.properties.digits,
                fieldName = 'huc_' + hucType + '_name',
                _model;

            //
            // Add an additional search filter option
            //
            _model = {
              name: 'territory__' + fieldName,
              op: 'has',
              // val: (self.search.params.territory) ? self.search.params.territory : null
              val: territory.properties.name
            };

              // self.search.model.territory = _model;

            var territories = {
              name: territory.properties.name,
              val: territory.properties.name,
              model: _model,
              category: 'My Watersheds'
            };

            self.search.options.territory.push(territories);
            self.myWatersheds[territory.properties.name] = territories;
          });
        }

        if (userResponse.properties.groups.length) {
          User.groups({
            id: $rootScope.user.id
          }).$promise.then(function(groupsResponse) {
            angular.forEach(groupsResponse.features, function(group) {

              console.log('group', group)

              var fieldName = 'groups',
                  _model;

              //
              // Add an additional search filter option
              //
              _model = {
                name: 'groups__name',
                op: 'any',
                // val: (self.search.params.territory) ? self.search.params.territory : null
                val: group.properties.organization.properties.name
              };

                // self.search.model.territory = _model;

              var thisGroup = {
                name: group.properties.organization.properties.name,
                val: group.properties.organization.properties.name,
                model: _model,
                category: 'My groups'
              };

              self.search.options.groups.push(thisGroup);
              self.myGroups[group.properties.organization.properties.name] = thisGroup;
            });

            self.changeTerritorySearchType();
            self.changeGroupSearchType();
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
