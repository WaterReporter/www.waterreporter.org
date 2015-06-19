'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter
 * @description
 *     The WaterReporter Website and associated User/Manager Site
 * Main module of the application.
 */
angular
  .module('WaterReporter', [
    'ngCookies',
    'ipCookie',
    'ngAria',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'leaflet-directive',
    'angularPhotoio',
    'ui.gravatar',
    'Mapbox'
  ]);

'use strict';

/**
 * @ngdoc overview
 * @name waterReporterApp
 * @description
 *     The WaterReporter Website and associated User/Manager Site
 *     Main routes of the application.
 */
angular.module('WaterReporter')
  .config(function ($locationProvider, $routeProvider) {

    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    //
    // For any unmatched url, redirect to home
    //
    // @see https://github.com/angular-ui/ui-router/wiki/URL-Routing
    //
    // $urlRouterProvider.otherwise('/');

    //
    // Make sure that HTML mode is enabled
    //
    // @see https://docs.angularjs.org/api/ng/provider/$locationProvider#html5Mode
    //
    // Requires:
    //
    //    `<base href="/" />`
    //
    $locationProvider.html5Mode(true);
  });
'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the User endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('Account', function (ipCookie) {
    
    var Account = {

    };

    return Account;
  });
'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the Comment endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('Comment', ['$resource', function ($resource) {
    return $resource('//api.waterreporter.org/v1/data/comment/:id', {
      id: '@id'
    }, {
      query: {
        isArray: false
      },
      update: {
        method: 'PATCH'
      }
    });
  }]);
'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the Image endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('Image', ['$resource', function ($resource) {
    return $resource('//api.waterreporter.org/v1/data/image/:imageId', {}, {
      query: {
        isArray: false
      },
      update: {
        method: 'PATCH'
      }
    });
  }]);
'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the Organization endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('Organization', ['$resource', function ($resource) {
    return $resource('//api.waterreporter.org/v1/data/organization/:organizationId', {}, {
      query: {
        isArray: false
      },
      update: {
        method: 'PATCH'
      }
    });
  }]);
'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the Report endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('Report', function ($resource) {
    return $resource('http://api.waterreporter.org/v1/data/report/:id', {
      id: '@id'
    }, {
      query: {
        isArray: false
      },
      close: {
        method: 'PATCH'
      },
      comments: {
        method: 'GET',
        url: 'http://api.waterreporter.org/v1/data/report/:id/comments',
        params: {
          q: {
            order_by: [
              {
                field: 'created',
                direction: 'asc'
              }
            ]
          },
          results_per_page: 1000
        }
      }
    });
  });
'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the User endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('User', ['$resource', function ($resource) {
    return $resource('//api.waterreporter.org/v1/data/user/:id', {
      id: '@id'
    }, {
      query: {
        isArray: false
      },
      update: {
        method: 'PATCH'
      },
      getOrganizations: {
        method: 'GET',
        isArray: false,
        url: '//api.waterreporter.org/v1/data/user/:id/organization'
      }
    });
  }]);
'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter
 * @description
 *     The WaterReporter Website and associated User/Manager Site
 * Main module of the application.
 */
angular
  .module('Mapbox', [
    'leaflet-directive'
  ]);

'use strict';

/*jshint camelcase: false */

/**
 * @ngdoc directive
 * @name managerApp.directive:mapboxGeocoder
 * @description
 *   The Mapbox Geocoder directive enables developers to quickly add inline
 *   geocoding capabilities to any HTML <input> or <textarea>
 */
angular.module('Mapbox')
  .directive('mapboxGeocoder', ['$compile', '$http', '$templateCache', '$timeout', 'mapbox', 'geocoding', 'TemplateLoader', function ($compile, $http, $templateCache, $timeout, mapbox, geocoding, TemplateLoader) {
     
    return {
        restrict: 'A',
        scope: {
          mapboxGeocoderDirection: '=?',
          mapboxGeocoderQuery: '=',
          mapboxGeocoderResponse: '=',
          mapboxGeocoderResults: '=?',
          mapboxGeocoderAppend: '=?'
        },
        link: function(scope, element, attrs) {

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
          TemplateLoader.get('/modules/shared/mapbox/geocoderResults--view.html')
            .success(function(templateResult) {
              element.after($compile(templateResult)(scope));
            });

          //
          // This tells us if we are using the Forward, Reverse, or Batch
          // Geocoder provided by the Mapbox Geocoding API
          //
          scope.mapboxGeocoderDirection = (scope.mapboxGeocoderDirection) ? scope.mapboxGeocoderDirection: 'forward';

          //
          // Keep an eye on the Query model so that when it's updated we can
          // execute a the Reuqest agains the Mapbox Geocoding API
          //
          scope.$watch('mapboxGeocoderQuery', function(query) {

            var query_ = (scope.mapboxGeocoderAppend) ? query + ' ' + scope.mapboxGeocoderAppend : query;

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
              if (query && !scope.mapboxGeocoderResponse) {
                var results = geocoding[scope.mapboxGeocoderDirection](query_).success(function(results) {
                  scope.mapboxGeocoderResults = results;
                });
              }

            }, 500);

          });

          //
          // Geocoded Address Selection
          //
          scope.address = {
            select: function(selectedValue) {

              //
              // Assign the selected value to back to our scope. The developer
              // should be able to use the results however they like. For
              // instance they may need to use the `Response` from this request
              // to perform a query against another database for geolookup or 
              // save this value to the database.
              //
              scope.mapboxGeocoderQuery = selectedValue.place_name;
              scope.mapboxGeocoderResponse = selectedValue;

              //
              // Once we're finished we need to make sure we empty the result
              // list. An empty result list will be hidden.
              //
              scope.mapboxGeocoderResults = null;
            }
          };

        }
    };
  }]);
'use strict';

/**
 * @ngdoc service
 *
 * @name cleanWaterCommunitiesApp.Geocode
 *
 * @description
 *   The Geocode Service provides access to the Mapbox Geocoding API
 *
 * @see https://www.mapbox.com/developers/api/geocoding/
 */
angular.module('Mapbox')
  .service('geocoding', ['$http', 'mapbox', function Navigation($http, mapbox) {
    return {

      /**
       * Retrieve a list of possible geocoded address from the Mapbox Geocoding
       * API, based on user input.
       *
       * @param (string) requestedLocation
       *    A simple string containing the information you wish to check
       *    against the Mapbox Geocoding API
       *
       * @return (object) featureCollection
       *    A valid GeoJSON Feature Collection containing a list of matched
       *    addresses and their associated geographic information
       *
       * @see https://www.mapbox.com/developers/api/geocoding/
       *
       */
      forward: function(requestedLocation) {

        //
        // Check to make sure that the string is not empty prior to submitting
        // it to the Mapbox Geocoding API
        //
        if (!requestedLocation) {
          return;
        }

        //
        // Created a valid Mapbox Geocoding API compatible URL
        //
        var mapboxGeocodingAPI = mapbox.geocodingUrl.concat(requestedLocation, '.json');

        //
        // Send a GET request to the Mapbox Geocoding API containing valid user
        // input
        //
        var promise = $http.get(mapboxGeocodingAPI, {
          params: {
            'callback': 'JSON_CALLBACK',
            'access_token': mapbox.access_token
          }
        })
          .success(function(featureCollection) {
            return featureCollection;
          })
          .error(function(data) {
            console.error('Mapbox Geocoding API could not return any results based on your input', data);
          });

        //
        // Always return Requests in angular.services as a `promise`
        //
        return promise;
      },

      /**
       * Retrieve a list of possible addresses from the Mapbox Geocoding
       * API, based on user input.
       *
       * @param (array) requestedCoordinates
       *    A two value array containing the longitude and latitude respectively
       *    
       *    Example:
       *    [
       *       '<LONGITUDE>',
       *       '<LATITUDE>',
       *    ]
       *
       * @return (object) featureCollection
       *    A valid GeoJSON Feature Collection containing a list of matched
       *    addresses and their associated geographic information
       *
       * @see https://www.mapbox.com/developers/api/geocoding/
       *
       */
      reverse: function(requestedCoordinates) {

        //
        // Check to make sure that the string is not empty prior to submitting
        // it to the Mapbox Geocoding API
        //
        if (!requestedCoordinates) {
          return;
        }

        //
        // Created a valid Mapbox Geocoding API compatible URL
        //
        var mapboxGeocodingAPI = mapbox.geocodingUrl.concat(requestedCoordinates[0], ',', requestedCoordinates[1], '.json');

        //
        // Send a GET request to the Mapbox Geocoding API containing valid user
        // input
        //
        var promise = $http.get(mapboxGeocodingAPI, {
          params: {
            'callback': 'JSON_CALLBACK',
            'access_token': mapbox.access_token
          }
        })
          .success(function(featureCollection) {
            //
            // Return the valid GeoJSON FeatureCollection sent by Mapbox to
            // the module requesting the data with this Service
            //
            return featureCollection;
          })
          .error(function(data) {
            console.error('Mapbox Geocoding API could not return any results based on your input', data);
          });

        //
        // Always return Requests in angular.services as a `promise`
        //
        return promise;
      },

      /**
       * Retrieve a list of possible geocoded address from the Mapbox Geocoding
       * API, based on user input.
       *
       * @param (array) requestedQueries
       *    An array of up to 50 queries to perform. Each individual query
       *    should be a simple string containing the information you wish to
       *    check against the Mapbox Geocoding API
       *
       * @return (object) featureCollection
       *    A valid GeoJSON Feature Collection containing a list of matched
       *    addresses and their associated geographic information
       *
       * @see https://www.mapbox.com/developers/api/geocoding/
       *
       */
      batch: function(requestedQueries) {
        console.warning('Mapbox Geocoding Batch Geocoding not implemented, see https://www.mapbox.com/developers/api/geocoding/ for more information.');
      }
    };

  }]);

'use strict';

/**
 * @ngdoc service
 * @name cleanWaterCommunitiesApp.GeometryService
 * @description
 *   
 */
angular.module('Mapbox')
  .service('mapboxGeometry', ['$http', 'leafletData', function Navigation($http, leafletData) {
    return {
      drawGeoJSON: function(geojson, featureGroup, layerStyle, appendToLayer) {

        var self = this;

        leafletData.getMap().then(function(map) {
          //
          // Reset the FeatureGroup because we don't want multiple parcels drawn on the map
          //
          map.removeLayer(featureGroup);

          //
          // Convert the GeoJSON to a layer and add it to our FeatureGroup
          //
          // $scope.geojsonToLayer(geojson, featureGroup);
          self.geojsonToLayer(geojson, featureGroup);

          //
          // Add the FeatureGroup to the map
          //
          map.addLayer(featureGroup);
        });
      },
      /**
       * Convert a valid GeoJSON object to a valid Leaflet/Mapbox layer so that
       * it can be displayed on a Leaflet Map
       *
       * @param (object) geojsonObject
       *    A valid GeoJson object
       *
       *    @see http://geojson.org/geojson-spec.html#geojson-objects
       *
       * @param (object) targetLayer
       *    A valid Leaflet LayerGroup or FeatureGroup
       *
       *    @see http://leafletjs.com/reference.html#layergroup
       *    @see http://leafletjs.com/reference.html#featuregroup
       *
       * @param (object) layerStyle
       *
       * @param (boolean) appendToLayer
       *    If set to `true` the object will be appended to the Group and keep
       *    all the other objects that alread exist within the provided Group,
       *    defaults to clearning all content from provided Group
       *
       * @return (implicit)
       *    Adds the requested GeoJSON to the provided layer
       *
       * @required This function requires that Leaflet be loaded into this
       *           application and depends on the AngularLeafletDirective
       *
       */
      geojsonToLayer: function(geojsonObject, targetLayer, layerStyle, appendToLayer) {

        //
        // Should this GeoJSON object be appended to all existing Features or
        // should it replace all other objects?
        //
        // Defaults to clearing the layer and adding only the new geojsonObject
        // defined in the function arguments
        //
        if (!appendToLayer) {
          targetLayer.clearLayers();
        }

        //
        // Determine if the user has defined styles to be applied to this layer
        // if not, then use our default polygon outline
        //
        layerStyle = (layerStyle) ? layerStyle: {
          stroke: true,
          fill: false,
          weight: 3,
          opacity: 1,
          color: 'rgb(255,255,255)',
          lineCap: 'square'
        };

        //
        // Make sure the GeoJSON object is added to the layer with appropriate styles
        //
        L.geoJson(geojsonObject, {
          style: layerStyle
        }).eachLayer(function(newLayer) {
          console.log('newLayer', newLayer)
          newLayer.addTo(targetLayer);
          newLayer.bindPopup('<strong>' + newLayer.feature.properties.owner.properties.first_name + '</strong> reported on ' + newLayer.feature.properties.report_date + '<br /><small><a href="/reports/' + newLayer.feature.id + '">View Report</a></small>');
        });

      },
      /**
       * Retrieve a list of possible matching geometries based on user defined
       * geometry passed from application
       *
       * @param (array) requestedLocation
       *    A simple object containing a longitude and latitude.
       *
       *    @see http://leafletjs.com/reference.html#latlng-l.latlng
       *
       * @return (object) featureCollection
       *    A valid GeoJSON Feature Collection containing a list of matched
       *    addresses and their associated geographic information
       *
       */
      intersects: function(requestedLocation, collection) {

        // //
        // // Check to make sure that the string is not empty prior to submitting
        // // it to the Mapbox Geocoding API
        // //
        // if (!requestedLocation) {
        //   return;
        // }

        // //
        // // Created a valid Mapbox Geocoding API compatible URL
        // //
        // var ccGeometryAPI = commonscloud.baseurl.concat(collection, '/', 'intersects', '.geojson');

        // //
        // // Send a GET request to the Mapbox Geocoding API containing valid user
        // // input
        // //
        // var promise = $http.get(ccGeometryAPI, {
        //   params: {
        //     'callback': 'JSON_CALLBACK',
        //     'geometry': requestedLocation.lng + ' ' + requestedLocation.lat
        //   }
        // })
        //   .success(function(featureCollection) {
        //     return featureCollection;
        //   })
        //   .error(function(data) {
        //     console.error('CommonsCloud Geospatial API could not return any results based on your input', data, requestedLocation);
        //   });

        // //
        // // Always return Requests in angular.services as a `promise`
        // //
        // return promise;
      },
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name managerApp.directive:Map
 * @description
 *   Assist Directives in loading templates
 */
angular.module('Mapbox')
  .service('Map', ['mapbox', function (mapbox) {

    var Map = {
      defaults: {
        scrollWheelZoom: false,
        maxZoom: 19
      },
      layers: {
        baselayers: {
          basemap: {
            name: 'Satellite Imagery',
            url: 'https://{s}.tiles.mapbox.com/v3/' + mapbox.map_id + '/{z}/{x}/{y}.png',
            type: 'xyz',
            layerOptions: {
              attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a>'
            }
          }
        }
      },
      center: {},
      styles: {
        icon: {
          parcel: {
            iconUrl: 'https://api.tiles.mapbox.com/v4/marker/pin-l-cc0000.png?access_token=' + mapbox.access_token,
            iconRetinaUrl: 'https://api.tiles.mapbox.com/v4/marker/pin-l-cc0000@2x.png?access_token=' + mapbox.access_token,
            iconSize: [35, 90],
            iconAnchor: [18, 44],
            popupAnchor: [0, 0]
          }
        },
        polygon: {
          parcel: {
            stroke: true,
            fill: false,
            weight: 3,
            opacity: 1,
            color: 'rgb(255,255,255)',
            lineCap: 'square'
          },
          canopy: {
            stroke: false,
            fill: true,
            weight: 3,
            opacity: 1,
            color: 'rgb(0,204,34)',
            lineCap: 'square',
            fillOpacity: 0.6
          },
          impervious: {
            stroke: false,
            fill: true,
            weight: 3,
            opacity: 1,
            color: 'rgb(204,0,0)',
            lineCap: 'square',
            fillOpacity: 0.6
          }
        }
      },
      geojson: {}
    };
    
    return Map;
  }]);
'use strict';

/**
 * @ngdoc service
 * @name cleanWaterCommunitiesApp.Site
 * @description
 * # Site
 * Service in the cleanWaterCommunitiesApp.
 */
angular.module('Mapbox')
  .constant('mapbox', {
    geocodingUrl: 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places-v1/',
    access_token: 'pk.eyJ1IjoiZGV2ZWxvcGVkc2ltcGxlIiwiYSI6IjQ2YTM3YTdhNGU2NzYyMDc2ZjIzNDM4Yjg2MDc1MzRmIn0.bT4dOk8ewUnhJ3pyyOcWTg',
    map_id: 'developedsimple.mf7anga9'
  });

'use strict';

/**
 * @ngdoc service
 * @name cleanWaterCommunitiesApp.state
 * @description
 * # state
 * Service in the cleanWaterCommunitiesApp.
 */
angular.module('Mapbox')
  .constant('states', {
    list: [
      {
        abbr: 'AK',
        name: 'Alaska'
      },
      {
        abbr: 'AL',
        name: 'Alabama'
      },
      {
        abbr: 'AR',
        name: 'Arkansas'
      },
      {
        abbr: 'AZ',
        name: 'Arizona'
      },
      {
        abbr: 'CA',
        name: 'California'
      },
      {
        abbr: 'CO',
        name: 'Colorado'
      },
      {
        abbr: 'CT',
        name: 'Connecticut'
      },
      {
        abbr: 'DE',
        name: 'Delaware'
      },
      {
        abbr: 'DC',
        name: 'District of Columbia'
      },
      {
        abbr: 'FL',
        name: 'Florida'
      },
      {
        abbr: 'GA',
        name: 'Georgia'
      },
      {
        abbr: 'HI',
        name: 'Hawaii'
      },
      {
        abbr: 'IA',
        name: 'Iowa'
      },
      {
        abbr: 'ID',
        name: 'Idaho'
      },
      {
        abbr: 'IL',
        name: 'Illinois'
      },
      {
        abbr: 'IN',
        name: 'Indiana'
      },
      {
        abbr: 'KS',
        name: 'Kansas'
      },
      {
        abbr: 'KY',
        name: 'Kentucky'
      },
      {
        abbr: 'LA',
        name: 'Louisiana'
      },
      {
        abbr: 'MA',
        name: 'Massachusetts'
      },
      {
        abbr: 'MD',
        name: 'Maryland'
      },
      {
        abbr: 'ME',
        name: 'Maine'
      },
      {
        abbr: 'MI',
        name: 'Michigan'
      },
      {
        abbr: 'MN',
        name: 'Minnesota'
      },
      {
        abbr: 'MS',
        name: 'Mississippi'
      },
      {
        abbr: 'MO',
        name: 'Missouri'
      },
      {
        abbr: 'MT',
        name: 'Montana'
      },
      {
        abbr: 'NC',
        name: 'North Carolina'
      },
      {
        abbr: 'ND',
        name: 'North Dakota'
      },
      {
        abbr: 'NE',
        name: 'Nebraska'
      },
      {
        abbr: 'NH',
        name: 'New Hampshire'
      },
      {
        abbr: 'NJ',
        name: 'New Jersey'
      },
      {
        abbr: 'NM',
        name: 'New Mexico'
      },
      {
        abbr: 'NV',
        name: 'Nevada'
      },
      {
        abbr: 'NY',
        name: 'New York'
      },
      {
        abbr: 'OH',
        name: 'Ohio'
      },
      {
        abbr: 'OK',
        name: 'Oklahoma'
      },
      {
        abbr: 'OR',
        name: 'Oregon'
      },
      {
        abbr: 'PA',
        name: 'Pennsylvania'
      },
      {
        abbr: 'RI',
        name: 'Rhode Island'
      },
      {
        abbr: 'SC',
        name: 'South Carolina'
      },
      {
        abbr: 'SD',
        name: 'South Dakota'
      },
      {
        abbr: 'TN',
        name: 'Tennessee'
      },
      {
        abbr: 'TX',
        name: 'Texas'
      },
      {
        abbr: 'UT',
        name: 'Utah'
      },
      {
        abbr: 'VA',
        name: 'Virginia'
      },
      {
        abbr: 'VT',
        name: 'Vermont'
      },
      {
        abbr: 'WA',
        name: 'Washington'
      },
      {
        abbr: 'WI',
        name: 'Wisconsin'
      },
      {
        abbr: 'WV',
        name: 'West Virginia'
      },
      {
        abbr: 'WY',
        name: 'Wyoming'
      }
    ]
  });

'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter
 * @description
 * # WaterReporter
 *
 * Main module of the application.
 */
angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user', {
        redirectTo: '/user/login'
      })
      .when('/user/login', {
        templateUrl: '/modules/shared/security/securityLogin--view.html',
        controller: 'SecurityController',
        controllerAs: 'security'
      });
  });
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
  .controller('SecurityController', function ($http, $location, Security, ipCookie, $route, $timeout) {

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
            // Direct the user to the next step in the registration process
            //
            $location.hash('');
            $location.path('/dashboard');
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

'use strict';

/*jshint camelcase:false*/

/**
 * @ngdoc service
 * @name WaterReporter.Security
 * @description
 * # Security
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('Security', function(ipCookie, $http, $resource) {

    var Security = $resource('//api.waterreporter.org/login', {}, {
      save: {
        method: 'POST',
        url: '//api.waterreporter.org/v1/auth/remote',
        params: {
          response_type: 'token',
          client_id: 'SG92Aa2ejWqiYW4kI08r6lhSyKwnK1gDN2xrryku',
          redirect_uri: 'http://127.0.0.1:9000/authorize',
          scope: 'user',
          state: 'json'
        }
      },
      register: {
        method: 'POST',
        url: '//api.waterreporter.org/v1/user/register'
      }
    });

    Security.has_token = function() {
      return (ipCookie('WATERREPORTER_SESSION')) ? true: false;
    };

    return Security;
  });

'use strict';

/*jshint sub:true*/

/**
 * @ngdoc service
 * @name WaterReporter.SecurityInterceptor
 * @description
 * # SecurityInterceptor
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .factory('SecurityInterceptor', ['$q', 'ipCookie', function ($q, ipCookie) {

    return {
      request: function(config) {

        var sessionCookie = ipCookie('WATERREPORTER_SESSION');

        //
        // Configure our headers to contain the appropriate tags
        //
        config.headers = config.headers || {};

        if (config.headers['Authorization-Bypass'] === true) {
          delete config.headers['Authorization-Bypass'];
          return config || $q.when(config);
        }

        if (sessionCookie) {
          config.headers.Authorization = 'Bearer ' + sessionCookie;
        }

        config.headers['Cache-Control'] = 'no-cache, max-age=0, must-revalidate';

        //
        // Configure or override parameters where necessary
        //
        config.params = (config.params === undefined) ? {} : config.params;

        console.debug('SecurityInterceptor::Request', config || $q.when(config));

        return config || $q.when(config);
      },
      response: function(response) {
        console.debug('AuthorizationInterceptor::Response', response || $q.when(response));
        return response || $q.when(response);
      },
      responseError: function (response) {
        console.debug('AuthorizationInterceptor::ResponseError', response || $q.when(response));
        return $q.reject(response);
      }
    };
  }]).config(function ($httpProvider) {
    $httpProvider.interceptors.push('SecurityInterceptor');
  });

'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the Search endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .service('Search', function ($location, $route) {
    
    /**
     * Private Functions and Variables for the Search Service
     */
     var _Search = {};


    /**
     * Public Functions and Variables for the Search Service
     */
     var Search = {
        resource: {},
        model: {},
        data: {},
        defaults: function() {

          var q = ($location.search() && $location.search().q) ? angular.fromJson($location.search().q): [],
              params = {};

          //
          // If no q.filters are present in the browser's address bar, then we
          // need to exit now and simply return an empty array.
          //
          if (!q.filters || !q.filters.length) {
            return params;
          }

          //
          // However, if there are available q.filters, we need to process those
          // and get those values autopopulated in the view so the user isn't
          // confused by the empty fields with filtered results
          //
          angular.forEach(q.filters, function(filter) {

            //
            // Build the value for the filter
            //
            if (filter.op === 'ilike') {
              //
              // With iLike we use a % at the beginning and end of the string
              // so that the data base knows where to start and end looking
              // for the user defined string.
              //
              // When the user reloads the page we need to make sure that those
              // %'s are automatically removed from the string so as not to
              // confuse the user.
              //
              params[filter.name] = filter.val.slice(1,-1);
            }
            else {
              params[filter.name] = filter.val;
            }

          });

          return params;
       },
       params: {}, // On initial page load, load in our defaults from the address bar
       paginate: function(pageNumber) {
        var params = $location.search();

        if (angular.isObject(params.q)) {
          $location.search('q', JSON.stringify(params.q));
        }

        $location.search('page', pageNumber);
        $route.reload();
      },
      autoload: function() {
        this.execute(true);
       },
       hashtag: function(tag, field) {
          this.params[field] = tag;
          this.execute();
       },
       clear: function() {
        $location.search('');
        $route.reload();
       },
       execute: function(append) {

          var service = this,
              params = service.params,
              q = {
                filters: [],
                order_by: [{
                  field: 'report_date',
                  direction: 'desc'
                }]
              };

          //
          // Loop over each of the parameters that the search allows the user
          // to fill in and for each one, use the provided model to build out
          // a proper Filters array
          //
          angular.forEach(params, function(field_value, field_name) {

            //
            // Get the information for the model
            //
            var filter = service.model[field_name];

            //
            // Build the value for the filter
            //
            if (filter.op === 'ilike') {
              filter.val = '%' + field_value + '%';
            }

            //
            // Pass off the completed filter to the `q` parameter for
            // processing
            //
            q.filters.push(filter);

          });

          //
          // With a completed `q` parameter, we can now pass it back to the
          // browser's address bar
          //
          $location.search({
            'q': angular.toJson(q)
          });

          //
          // Finally, use the resource to load the new Features based on the
          // user-defined query input.
          //
          service.resource.query($location.search()).$promise.then(function(response) {
            service.data = (append) ? service.data.features+=response.features : response;
          });
        }
     };

     return Search;
  });
'use strict';

/**
 * @ngdoc service
 * @name WaterReporter
 * @description
 * Provides access to the Search endpoint of the WaterReporter API
 * Service in the WaterReporter.
 */
angular.module('WaterReporter')
  .directive('searchScrollToLoad', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
      
        var raw = element[0];

        console.log('searchScrollToLoad');

        element.bind('scroll', function() {
          console.log('in scroll');
          console.log(raw.scrollTop + raw.offsetHeight);
          console.log(raw.scrollHeight);

          if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
            console.log('APPLY');
            scope.$apply(attrs.searchScrollToLoad);
          }
          else {
            console.log('NOPE');
          }

          console.log('event');
        });

      }
    };
  });
'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.about.config:about-routes
 * @description
 *     Routes for the states applying to the about page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/about', {
        templateUrl: '/modules/components/about/about--view.html',
        controller: 'AboutController',
        controllerAs: 'about'
      });
  });
'use strict';

/**
 * @ngdoc function
 * @name wr.about.controller:AboutController
 * @description
 * # AboutController
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('AboutController', function () {

  });
'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.singleReport.config:report-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the single report page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    
    $routeProvider
      .when('/dashboard', {
        templateUrl: '/modules/components/dashboard/dashboard--view.html',
        controller: 'DashboardController',
        controllerAs: 'dashboard',
        resolve: {
          reports: function($location, $route, Report) {

            //
            // Get all of our existing URL Parameters so that we can
            // modify them to meet our goals
            //
            var search_params = $location.search();

            //
            // Prepare any pre-filters to append to any of our user-defined
            // filters in the browser address bar
            //
            search_params.q = (search_params.q) ? angular.fromJson(search_params.q) : {};

            search_params.q.filters = (search_params.q.filters) ? search_params.q.filters : [];
            search_params.q.order_by = (search_params.q.order_by) ? search_params.q.order_by : [];

            //
            // We need to add the current user's territory to this 
            //

            //
            // Ensure that returned Report features are sorted newest first
            //
            search_params.q.order_by.push({
              field: 'report_date',
              direction: 'desc'
            });

            //
            // Execute our query so that we can get the Reports back
            //
            return Report.query(search_params);
          }
        }
      });

  });
'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.report.controller:SingleReportController
 * @description
 *     Display a single report based on the current `id` provided in the URL
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('DashboardController', function () {

    var self = this;

  });
'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.activity.config:activity-routes
 * @description
 *     Routes for the states applying to the activity feed page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/activity', {
        redirectTo: '/activity/list'
      })
      .when('/activity/list', {
        templateUrl: '/modules/components/activity/activity--view.html',
        controller: 'ActivityController',
        controllerAs: 'activity',
        reloadOnSearch: false,
        resolve: {
          reports: function($location, $route, Report) {

            //
            // Get all of our existing URL Parameters so that we can
            // modify them to meet our goals
            //
            var search_params = $location.search();

            //
            // Prepare any pre-filters to append to any of our user-defined
            // filters in the browser address bar
            //
            search_params.q = (search_params.q) ? angular.fromJson(search_params.q) : {};

            search_params.q.filters = (search_params.q.filters) ? search_params.q.filters : [];
            search_params.q.order_by = (search_params.q.order_by) ? search_params.q.order_by : [];

            //
            // Ensure that returned Report features are sorted newest first
            //
            search_params.q.order_by.push({
              field: 'report_date',
              direction: 'desc'
            });

            //
            // Execute our query so that we can get the Reports back
            //
            return Report.query(search_params);
          }
        }            
      });
  });
'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.activity.controller:ActivityFeedController
 * @description
 * # ActivityFeedController
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('ActivityController', function (Report, reports, Search) {

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

    this.search.model = {
      report_description: {
        name: 'report_description',
        op: 'ilike',
        val: ''
      }
    };

    this.search.resource = Report;

    this.search.data = reports;

  });
'use strict';

/**
 * @ngdoc overview
 * @name wr.home.config:home-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the home page of the application.
 */
angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/modules/components/home/home--view.html',
        controller: 'HomeController',
        controllerAs: 'home'
      });
  });
'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.home.controller:HomeController
 * @description
 * # HomeController
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('HomeController', function () {
    
  });
'use strict';

/**
 * @ngdoc overview
 * @name wr.map.config:map-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the map page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/map', {
        redirectTo: '/activity/map'
      })
      .when('/activity/map', {
        templateUrl: '/modules/components/map/map--view.html',
        controller: 'MapController',
        controllerAs: 'activity',
        reloadOnSearch: false,
        resolve: {
          reports: function($location, $route, Report) {

            //
            // Get all of our existing URL Parameters so that we can
            // modify them to meet our goals
            //
            var search_params = $location.search();

            //
            // Prepare any pre-filters to append to any of our user-defined
            // filters in the browser address bar
            //
            search_params.q = (search_params.q) ? angular.fromJson(search_params.q) : {};

            search_params.q.filters = (search_params.q.filters) ? search_params.q.filters : [];
            search_params.q.order_by = (search_params.q.order_by) ? search_params.q.order_by : [];

            //
            // Ensure that returned Report features are sorted newest first
            //
            search_params.q.order_by.push({
              field: 'report_date',
              direction: 'desc'
            });

            //
            // Execute our query so that we can get the Reports back
            //
            return Report.query(search_params);
          }
        }
      });
  });
'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.map.controller:MapController
 * @description
 * # MapController
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('MapController', function ($location, mapboxGeometry, leafletData, Map, mapbox, Report, reports, $scope, Search) {

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

    this.search.params = Search.defaults();

    this.search.model = {
      report_description: {
        name: 'report_description',
        op: 'ilike',
        val: ''
      }
    };

    this.search.resource = Report;

    this.search.data = reports;


    //
    // 
    //
    leafletData.getMap().then(function(map) {

      $scope.$on('leafletDirectiveMarker.mouseover', function(event, args) {
        args.leafletEvent.target.openPopup();
      });

      $scope.$on('leafletDirectiveMarker.mouseout', function(event, args) {
        args.leafletEvent.target.closePopup();
      });

      $scope.$on('leafletDirectiveMarker.click', function(event, args) {
        console.log('args', args);
        // $location.path($scope.markers[args.markerName].permalink);
      });
    });



    this.loadMap = function() {
      self.search.data.$promise.then(function(reports_) {
          self.map.geojson.reports = {
              data: reports_
          };

          //
          // Define a layer to add geometries to later
          //
          // @see http://leafletjs.com/reference.html#featuregroup
          //
          var featureGroup = new L.FeatureGroup();

          var layerStyle = self.map.styles.icon.parcel;

          mapboxGeometry.drawGeoJSON(self.map.geojson.reports.data, featureGroup, layerStyle);

           //
           // @hack
           //    this is only a temporary solution until we get the new `bbox`
           //    functionality within the WaterReporter API
           //
          leafletData.getMap().then(function(map) {
              var bounds = featureGroup.getBounds();

              if (bounds && bounds._southWest !== undefined) {
                  map.fitBounds(featureGroup.getBounds());
              }
          });
       });
    };


    /**
     * Setup the Mapbox map for this page with the results we got from the API
     *
     * @data this.map
     *    loads the Map Service into our page scope
     * @data this.map.geojson.reports
     *    loads the request report information into the map
     *
     */
    this.map = Map;

    L.Icon.Default.imagePath = '/images';

    $scope.$watch(angular.bind(this, function () {
      return this.search;
    }), function () {
        if (self.search && self.search.data) {
            self.loadMap();
         }
    }, true);

  });
'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.profile.config:profile-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the profile page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/profiles', {
        templateUrl: '/modules/components/profile/profiles--view.html',
        controller: 'ProfilesController',
        controllerAs: 'profiles',
        resolve: {
          profiles: function($location, User) {

            //
            // Get all of our existing URL Parameters so that we can
            // modify them to meet our goals
            //
            var search_params = $location.search();

            //
            // Prepare any pre-filters to append to any of our user-defined
            // filters in the browser address bar
            //
            search_params.q = (search_params.q) ? angular.fromJson(search_params.q) : {};

            search_params.q.filters = (search_params.q.filters) ? search_params.q.filters : [];
            search_params.q.order_by = (search_params.q.order_by) ? search_params.q.order_by : [];

            //
            // Execute our query so that we can get the Reports back
            //
            return User.query(search_params);
          }
        }
      })
      .when('/profiles/:userId', {
        templateUrl: '/modules/components/profile/profile--view.html',
        controller: 'ProfileController',
        controllerAs: 'profile',
        resolve: {
          profile: function($route, User) {
            return User.get({
              id: $route.current.params.userId
            });
          },
          organizations: function($route, User) {
            return User.getOrganizations({
              id: $route.current.params.userId
            });
          },
          closures: function(Report, $route) {

            var search_params = {
              q: {
                filters: [
                  {
                    name: 'closed_by__id',
                    op: 'has',
                    val: $route.current.params.userId
                  }
                ]
              }
            };

            return Report.query(search_params);
          },
          reports: function($location, $route, Report) {

            //
            // Get all of our existing URL Parameters so that we can
            // modify them to meet our goals
            //
            var search_params = $location.search();

            //
            // Prepare any pre-filters to append to any of our user-defined
            // filters in the browser address bar
            //
            search_params.q = (search_params.q) ? angular.fromJson(search_params.q) : {};

            search_params.q.filters = (search_params.q.filters) ? search_params.q.filters : [];
            search_params.q.order_by = (search_params.q.order_by) ? search_params.q.order_by : [];

            //
            // Ensure that returned Report features are sorted newest first
            //
            search_params.q.filters.push({
              name: 'owner_id',
              op: 'eq',
              val: $route.current.params.userId
            });

            search_params.q.order_by.push({
              field: 'report_date',
              direction: 'desc'
            });

            //
            // Execute our query so that we can get the Reports back
            //
            return Report.query(search_params);
          }
        }
      });
  });
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
'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.profile.controller:ProfileController
 * @description
 * # ProfileController
 * Controller of the WaterReporter
 */
angular.module('WaterReporter')
  .controller('ProfileController', function (closures, organizations, profile, reports) {
    this.data = profile;
    this.organizations = organizations;

    this.reports = reports;

    this.closures = closures;

    this.visible = {
      reports: true,
      closures: false
    };

    console.log('profile', profile, organizations, reports, closures);
  });
'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.singleReport.config:report-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the single report page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    
    $routeProvider
      .when('/reports/:reportId', {
        templateUrl: '/modules/components/report/report--view.html',
        controller: 'ReportController',
        controllerAs: 'report',
        resolve: {
          report: function($route, Report) {
            return Report.get({
              id: $route.current.params.reportId
            });
          },
          comments: function($route, Report) {
            return Report.comments({
              id: $route.current.params.reportId
            });
          }
        }
      });

  });
'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.report.controller:SingleReportController
 * @description
 *     Display a single report based on the current `id` provided in the URL
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('ReportController', function (comments, Comment, $location, $rootScope, report, Report, $route) {

    var self = this;

    self.data = report;
    
    self.comments = comments;

    /**
     * Setup Pinterest Rich Pins `<meta>` tags. Each of our Report objects
     * will their own Pinterest Rich Pins page
     *
     * @see https://developers.pinterest.com/rich_pins_place/
     */
    $rootScope.meta = {
      og: {
        site_name: 'WaterReporter',
        title: 'Name of place',
        type: 'place',
        description: 'Description of the place',
        url: 'https://www.waterreporter.org/reports/1'
      },
      place: {
        location: {
          longitude: null,
          latitude: null
        }
      }
    };


    /**
     * Open Report functionality to the Cotnroller
     */
     self.comment = {
       data: {},
       update: function(comment, state) {
          var comment_ = new Comment({
            body: comment.properties.body,
            report_state: state
          });

          comment_.$update({
            id: comment.id
          }).then(function() {
            console.log('comment saved!!!');
            $route.reload();
          });
       },
       delete: function(commentId) {
        Comment.delete({
          id: commentId
        }).$promise.then(function(response) {
          console.log('response', response);
          $route.reload();
        });
       },
       close: function(reportId) {

        // Save the Comment
        self.comment.save(reportId, 'closed');

        // Close the Reprot
         Report.close({
          id: reportId,
          state: 'closed'
         }).$promise.then(function(response) {
           console.log('response', response);
           $route.reload();
         });
       },
       open: function(reportId, state) {

        // Save the Comment
        self.comment.save(reportId, 'open');

        // Close the Reprot
         Report.close({
          id: reportId,
          state: 'open'
         }).$promise.then(function(response) {
           console.log('response', response);
           $route.reload();
         });
       },
       save: function(reportId, state) {

        var comment = new Comment({
          body: self.comment.data.body,
          status: 'public',
          report_id: reportId,
          report_state: state
        });

        comment.$save(function() {
          console.log('comment saved!!!');
          $route.reload();
        });
       }
      };

     self.delete = function(reportId) {
       Report.delete({
         id: reportId        
       }).$promise.then(function(response) {
         console.log('response', response);
         $location.path('/activity/list');
       });
     };

  });
'use strict';

/**
 * @ngdoc overview
 * @name WaterReporter.submit.config:submitReport-routes
 * @description
 * # Water Reporter App
 *
 * Routes for the states applying to the submit report page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    
    $routeProvider
      .when('/submit', {
        templateUrl: '/modules/components/submit/submit--view.html',
        controller: 'SubmitController',
        controllerAs: 'submit'
      });
      
  });
'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.submit.controller:SubmitController
 * @description
 * # SubmitReportController
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('SubmitController', function ($location, Report) {

    var self = this;

    self.new = new Report();

    self.save = function() {

      self.new.state = 'open';
      self.new.is_public = true;

      self.new.$save(function(response) {
        console.log('response', response);
        $location.path('/activity/list');
      });
    };

  });