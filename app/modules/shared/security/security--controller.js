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
  .controller('SecurityController', ['$http', '$location', 'Security', 'ipCookie', '$route', '$timeout', function ($http, $location, Security, ipCookie, $route, $timeout) {

    var self = this;

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

    //
    // If the user has not authenicated, send them to the Login page. We can't
    // register or save Family information without a User object and token.
    //
    if (Security.has_token()) {
      $location.path('/licensee/' + $route.current.params.licensee + '/events');
    }

    self.login = {
      visible: true,
      submit: function() {

        console.log('Login submitted');

        self.login.processing = true;

        var credentials = new Security({
          email: self.login.email,
          password: self.login.password,
        });

        credentials.$save(function(response) {

          console.log('Login started');

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
            console.log('Login successful', response);
            self.login.processing = false;
            self.login.success = true;

            ipCookie.remove('SNAPOLOGY_COMMERCE_SESSION');
            ipCookie.remove('SNAPOLOGY_COMMERCE_LICENSEE');

            ipCookie('SNAPOLOGY_COMMERCE_SESSION', response.access_token, self.cookieOptions);
            ipCookie('SNAPOLOGY_COMMERCE_LICENSEE', $route.current.params.licensee, self.cookieOptions);

            //
            // Direct the user to the next step in the registration process
            //
            $location.hash('');
            $location.path('/licensee/' + ipCookie('SNAPOLOGY_COMMERCE_LICENSEE') + '/registration/');
          }
        }, function(error){
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

          console.log('New user registration success', response);

          self.register.processing = false;
          self.login.processing = true;

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
            self.login.submit();
          }
        }, function(error){
          self.login.processing = false;

          $timeout(function() {
            self.login.errors = null;
          }, 3500);
        });
      }
    };

  }]);
