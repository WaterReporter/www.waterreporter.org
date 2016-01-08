(function() {

  'use strict';

  /**
   * @ngdoc service
   *
   * @name
   * @description
   */
  angular.module('Groups')
    .service('group', function(GroupOrganization, User, UserGroup) {
      return {
        /**
         * Is Member
         *
         * Answer the question "Is the user a member of the group?"
         *
         * @param (obj) user
         *     The user object to test against
         * @param (int) groupId
         *     The unique identifier of the group
         *
         * @return (bool) isMember
         *     A boolean indicating whether or not the user is a member of the
         *     provided group
         */
        isMember: function(user, groupId) {

          var isMember = false,
              groupList = user.properties.groups;

          angular.forEach(groupList, function(group) {
            if (group.properties.organization_id === groupId) {
                isMember = true;
            }
          });

          return isMember;
        },
        /**
         * Member Role
         *
         * Returns the defined member's role
         *
         * @param (obj) user
         *     The user object to test against
         * @param (int) groupId
         *     The unique identifier of the group
         *
         * @return (str) role
         *     Returns a string representation of the provided user's role
         */
         memberRole: function(user, groupId) {

           var role,
               groupList = (user && user.properties) ? user.properties.groups : [];

           angular.forEach(groupList, function(group) {
             if (group.properties.organization_id === groupId) {
               if (group.properties.is_admin) {
                 role = 'admin';
               }
               else if (group.properties.is_member) {
                 role = 'member';
               }
               else {
                 role = 'pending';
               }
             }
           });

           return role;
         },
        /**
         * Member Since
         *
         * Extract member information from the user's groups.
         *
         * @param (obj) user
         *     The user object to test against
         * @param (int) groupId
         *     The unique identifier of the group
         *
         * @return (str) memberSince
         *
         */
        memberSince: function(user, groupId) {

          var memberSince = '',
              groupList = user.properties.groups;

          angular.forEach(groupList, function(group) {
            if (group.properties.organization_id === groupId) {
                memberSince = group.properties.joined_on;
            }
          });

          return memberSince;
        },
        /**
         * joinGroup
         *
         * Add an organization group to a user's profile.
         *
         * @param (obj) user
         *     The user object to test against
         * @param (int) groupId
         *     The unique identifier of the group
         *
         * @return (obj) $promise
         */
        joinGroup: function(user, groupId) {

          //
          // Add new group to the user's in-memory profile
          //
          user.properties.organization.push({
            id: groupId
          });

          user.properties.groups.push({
            properties: {
              organization_id: groupId,
              joined_on: new Date()
            }
          });

          //
          // Create a request and commit profile changes to the database
          //
          var userProfile = new User({
                id: user.id,
                groups: this.processGroups(user.properties.groups),
                organization: user.properties.organization
              });

          var $promise = userProfile.$update();

          return $promise;
        },
        /**
         * Remove Group Member
         *
         *
         */
        removeGroupMember: function(user, groupId) {

          var group = (user && user.properties) ? this.findGroup(user.properties.groups, groupId) : null;

          if (group === null) {
            return;
          }

          var $promise = UserGroup.remove({
            id: group.id
          });

          return $promise;
        },
        /**
         * Approve Group Member
         *
         *
         */
        approveGroupMember: function(user, groupId) {

          var group = (user && user.properties) ? this.findGroup(user.properties.groups, groupId) : null;

          if (group === null) {
            return;
          }

          //
          // This changes the live view of the members list without refreshing
          // the page
          //
          group.properties.is_member = true;

          //
          // This commits those changes to the database
          //
          var userGroupPermissions = new UserGroup({
                id: group.id,
                is_member: true
              });

          var $promise = userGroupPermissions.$update();

          return $promise;
        },
        /**
         * Leave Group
         *
         *
         */
        leaveGroup: function(user, groupId) {

        },
        /**
        * Find Group
        *
        * Find a single group in the user's list of groups
        *
        * @param (array) groupList
        *     A list of the user's groups
        * @param (int) groupId
        *     The unique identifier of the group to which you want to extract
        *
        * @return (obj) _return
        *     The group object extracted
         */
        findGroup: function(groupList, groupId) {

          var _return;

          //
          // Identify the group we want to use
          //
          angular.forEach(groupList, function(group) {
            if (group.properties.organization_id === groupId) {
                _return = group;
            }
          });

          return _return;
        },
        /**
         * processGroups
         *
         * Add an organization group to a user's profile.
         *
         * @param (array) list
         *     A list of a user's groups
         *
         * @return (bool) _return
         *     An cleaned up list of the user's groups ready to POST
         */
        processGroups: function(list) {

          var _return = [];

          angular.forEach(list, function(item) {

            var group;

            if (item && item.properties) {
              group = {
                organization_id: item.properties.organization_id,
                joined_on: item.properties.joined_on
              };
            } else if (item && item.organization_id) {
              group = {
                organization_id: item.organization_id,
                joined_on: item.joined_on
              };
            }

            _return.push(group);
          });

          return _return;
        },
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
