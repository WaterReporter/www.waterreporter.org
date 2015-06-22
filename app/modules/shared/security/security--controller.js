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
  .controller('SecurityController', function (Account, $http, $location, Security, ipCookie, $route, $rootScope, $timeout, User) {

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

            ipCookie.remove('WATERREPORTER_SESSION');

            ipCookie('WATERREPORTER_SESSION', response.access_token, self.cookieOptions);

            //
            // Make sure we also set the User ID Cookie, so we need to wait to
            // redirect until we're really sure the cookie is set
            //
            Account.setUserId().$promise.then(function() {
              Account.getUser().$promise.then(function(userResponse) {
                console.log('userResponse', userResponse);

                Account.userObject = userResponse;
                
                $rootScope.user = Account.userObject;
                $rootScope.isLoggedIn = Account.hasToken();
                $rootScope.isAdmin = Account.hasRole('admin');

                if ($rootScope.isAdmin) {
                  $location.path('/dashboard');
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

  });
