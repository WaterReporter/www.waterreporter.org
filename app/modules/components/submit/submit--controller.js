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
    .controller('SubmitController', function (Account, $location, Map, Report, $rootScope, $scope, user) {

      var self = this;

      //
      // Setup all of our basic date information so that we can use it
      // throughout the page
      //
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
      // Create a new Date object and assign to today so that we have some
      // default to work with
      //
      self.report = new Report({
        report_date: self.today
      });

      /**
       * Take our three separate date fields (i.e., month, day, year) and on
       * field updates change the report.report_date scoped object so that it
       * builds a proper Date object for our Report $resource
       */
      self.date = {
        month: self.months[self.today.getMonth()],
        day: self.today.getDate(),
        year: self.today.getFullYear()
      };

      $scope.$watch(angular.bind(this, function() {
        return this.date;
      }), function (response) {
        var _new = response.month + ' ' + response.day + ' ' + response.year,
            _date = new Date(_new);

        self.report.report_date = _date;
      }, true);


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
