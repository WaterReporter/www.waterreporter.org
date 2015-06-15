'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.profile.controller:ProfilesController
 * @description
 * # ProfilesController
 * Controller of the WaterReporter
 */
angular.module('WaterReporter')
  .controller('ProfilesController', function (profiles, Search, User) {
    
    this.data = profiles;

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

    // this.search.model = {
    //   report_description: {
    //     name: 'report_description',
    //     op: 'ilike',
    //     val: ''
    //   }
    // };

    // this.search.resource = User;

    this.search.data = profiles;

  });