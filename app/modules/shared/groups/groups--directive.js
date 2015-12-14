(function() {

  'use strict';

  /**
   * @ngdoc directive
   * @name
   * @description
   */
  angular.module('Groups')
    .directive('groups', function ($compile, group, $http, $templateCache, TemplateLoader, $timeout) {

      return {
          restrict: 'A',
          scope: {
            groupsQuery: '=',
            groupsResponse: '=',
            groupsResults: '=?'
          },
          link: function(scope, element) {

            //
            // Setup up our timeout and the Template we will use for display the
            // results from the Mapbox Geocoding API back to the user making the
            // Request
            //
            var timeout;

            //
            // Take the template that we loaded into $templateCache and pull
            // out the HTML that we need to create our drop down menu that
            // holds our Mapbox Geocoding API results
            //
            TemplateLoader.get('/modules/shared/groups/groupsResults--view.html')
              .success(function(templateResult) {
                element.after($compile(templateResult)(scope));
              });

            //
            // Keep an eye on the Query model so that when it's updated we can
            // execute a the Reuqest agains the Mapbox Geocoding API
            //
            scope.$watch('groupsQuery', function(query) {

              //
              // If the user types, make sure we cancel and restart the timeout
              //
              $timeout.cancel(timeout);

              //
              // If the user stops typing for 500 ms then we need to go ahead and
              // execute the query against the Mapbox Geocoding API
              //
              timeout = $timeout(function () {

                //
                // The Mapbox Geocoding Service in our application provides us
                // with a deferred promise with our Mapbox Geocoding API request
                // so that we can handle the results of that request however we
                // need to.
                //
                if (query && !scope.groupsResponse) {
                  group.organization(query).$promise.then(function(successResponse) {
                    scope.groupsResults = successResponse;
                  }, function(errorResponse) {
                    console.error('Organization Query could not return any results base your input', errorResponse);
                  });
                }

              }, 500);

            });

            //
            // Geocoded Address Selection
            //
            scope.group = {
              select: function(selectedValue) {

                //
                // Assign the selected value to back to our scope. The developer
                // should be able to use the results however they like. For
                // instance they may need to use the `Response` from this request
                // to perform a query against another database for geolookup or
                // save this value to the database.
                //
                scope.groupsQuery = selectedValue.place_name;
                scope.groupsResponse = selectedValue;

                //
                // Once we're finished we need to make sure we empty the result
                // list. An empty result list will be hidden.
                //
                scope.groupsResults = null;
              }
            };

          }
      };
    });

}());
