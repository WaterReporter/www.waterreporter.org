(function() {

  'use strict';

  /**
   * @ngdoc service
   *
   * @name
   * @description
   */
  angular.module('Groups')
    .service('group', function(GroupOrganization) {
      return {
        /**
         * Retrieve a list of possible organizations that match the user's input.
         *
         * @param (string) requestedOrganization
         *    A simple string containing the information you wish to check
         *    against the Organization endpoint
         *
         * @return (object) promise
         *    An array of objects containing matches that were indentified in
         *    the Organization endpoint
         *
         */
        organization: function(requestedOrganization) {

          //
          // Check to make sure that the string is not empty prior to submitting
          // it to the Organization endpoint
          //
          if (!requestedOrganization) {
            return;
          }


          //
          // Define an empty query parameter that we can add our user input
          // and other necessary characters to, in order to appropriately
          // perform the lookup.
          //
          var q = {
                'q': {
                  'filters': [
                    {
                      'name': 'name',
                      'op': 'ilike',
                      'val': ''.concat('%', requestedOrganization, '%')
                    }
                  ]
                }
              };

          console.log('q', q);

          //
          // Send a GET request to the Mapbox Geocoding API containing valid user
          // input
          //
          var promise = GroupOrganization.query(q);

          //
          // Always return Requests in angular.services as a `promise`
          //
          return promise;
        }
      };
    });

}());
