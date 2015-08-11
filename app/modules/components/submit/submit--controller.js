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
    .controller('SubmitController', function (Account, $location, Map, Report, $rootScope, user) {

      var self = this;


      self.today = new Date();

      self.months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ];

      //
      //
      //
      self.report = new Report({
        report_date: new Date()
      });

      //
      //
      //
      self.date = {
        month: self.months[self.today.getMonth()],
        day: self.today.getDate(),
        year: self.today.getFullYear()
      };

      //
      //
      //
      self.save = function() {

        self.report.state = 'open';
        self.report.is_public = true;

        // self.report.report_date = '2015-08-10T00:00:00';
        // self.report.report_description = '';

        self.report.$save(function(response) {
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
