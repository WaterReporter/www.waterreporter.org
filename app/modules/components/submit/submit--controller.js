(function() {

  'use strict';

  /**
   * @ngdoc function
   * @name WaterReporter.submit.controller:SubmitController
   * @description
   * # SubmitReportController
   * Controller of the waterReporterApp
   */
  angular.module('WaterReporter')
    .controller('SubmitController', function (Account, $location, Report, $rootScope, user) {

      var self = this;

      self.new = new Report();

      self.save = function() {

        self.new.state = 'open';
        self.new.is_public = true;

        // self.new.report_date = '2015-08-10T00:00:00';
        // self.new.report_description = '';

        self.new.$save(function(response) {
          $location.path('/reports/' + response.id);
        });
      };

      /**
       * This is the first page the authneticated user will see. We need to make
       * sure that their user information is ready to use. Make sure the
       * Account.userObject contains the appropriate information.
       */
      if (Account.userObject && !Account.userObject.id) {
        if (user) {
          user.$promise.then(function(userResponse) {
            Account.userObject = userResponse;
              $rootScope.user = Account.userObject;
              $rootScope.isLoggedIn = Account.hasToken();
              $rootScope.isAdmin = Account.hasRole('admin');
          });
        }
      }

    });

}());
