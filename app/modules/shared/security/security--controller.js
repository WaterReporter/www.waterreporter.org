'use strict';

/*jshint camelcase:false*/

/**
 * @ngdoc function
 * @name WaterReporter.controller:SecurityController
 * @description
 * # SecurityController
 * Controller of the WaterReporter
 */
angular.module('WaterReporter')
  .controller('SecurityController', function (Account, $http, $location, Security, ipCookie, $route, $rootScope, $timeout, Report, Search) {

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

    this.search.model = {
      report_description: {
        name: 'report_description',
        op: 'ilike',
        val: ''
      }
    };

    this.search.resource = Report;

    self.cookieOptions = {
      path: '/',
      expires: 2
    };

    //
    // We have a continuing problem with bad data being placed in the URL,
    // the following fixes that
    //
    $location.search({
      q: undefined,
      results_per_page: undefined
    });

    self.login = {
      visible: true,
      submit: function(firstTime) {

        self.login.processing = true;

        var credentials = new Security({
          email: self.login.email,
          password: self.login.password,
        });

        credentials.$save(function(response) {

          //
          // Check to see if there are any errors by checking for the existence
          // of response.response.errors
          //
          if (response.response && response.response.errors) {
            self.login.errors = response.response.errors;
            self.register.processing = false;
            self.login.processing = false;

            $timeout(function() {
              self.login.errors = null;
            }, 3500);
          } else {
            //
            // Make sure our cookies for the Session are being set properly
            //
            ipCookie.remove('WATERREPORTER_SESSION');
            ipCookie('WATERREPORTER_SESSION', response.access_token, self.cookieOptions);

            //
            // Make sure we also set the User ID Cookie, so we need to wait to
            // redirect until we're really sure the cookie is set
            //
            Account.setUserId().$promise.then(function() {
              Account.getUser().$promise.then(function(userResponse) {

                Account.userObject = userResponse;

                $rootScope.user = Account.userObject;
                $rootScope.isLoggedIn = Account.hasToken();
                $rootScope.isAdmin = Account.hasRole('admin');

                if ($rootScope.isAdmin) {
                  $location.path('/dashboard');
                }
                else if (firstTime) {
                  $location.path('/profiles/' + $rootScope.user.id + '/edit');
                }
                else {
                  $location.path('/activity/list');
                }
              });
            });

          }
        }, function(){
          self.login.processing = false;
          self.login.errors = {
            email: ['The email or password you provided was incorrect']
          };

          $timeout(function() {
            self.login.errors = null;
          }, 3500);
        });
      }
    };

    self.register = {
      visible: false,
      submit: function() {

        self.register.processing = true;

        Security.register({
          email: self.register.email,
          password: self.register.password
        }, function(response) {
          //
          // Check to see if there are any errors by checking for the existence
          // of response.response.errors
          //
          if (response.response && response.response.errors) {
            self.login.errors = response.response.errors;
            self.register.processing = false;
            self.login.processing = false;

            $timeout(function() {
              self.login.errors = null;
            }, 3500);

          } else {
            self.login.email = self.register.email;
            self.login.password = self.register.password;
            self.login.submit(true);
          }
        }, function(error){
          self.login.processing = false;

          $timeout(function() {
            self.login.errors = null;
          }, 3500);
        });
      }
    };

  });
