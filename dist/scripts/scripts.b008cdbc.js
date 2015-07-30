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
    'Mapbox',
    'exifReader',
    'angularMoment'
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

    //
    // For any unmatched url, redirect to home
    //
    $routeProvider
      .otherwise({
        redirectTo: '/activity'
      });

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
  .service('Account', function (ipCookie, User) {

    var Account = {
      userObject: {}
    };

    Account.getUser = function( ) {

      var userId = ipCookie('WATERREPORTER_CURRENTUSER');

      if (!userId) {
        return false;
      }

      var $promise = User.get({
        id: userId
      });

      return $promise;
    };

    Account.setUserId = function() {
      var $promise = User.me(function(accountResponse) {

        ipCookie('WATERREPORTER_CURRENTUSER', accountResponse.id, {
          path: '/',
          expires: 2
        });
        
        return accountResponse.id;
      });

      return $promise;
    };

    Account.hasToken = function() {
      if (ipCookie('WATERREPORTER_CURRENTUSER') && ipCookie('WATERREPORTER_SESSION')) {
        return true;
      }

      return false;
    };

    Account.hasRole = function(roleNeeded) {

      var roles = this.userObject.properties.roles;

      if (!roles) {
        return false;
      }

      for (var index = 0; index < roles.length; index++) {
        console.log(roleNeeded, '===', roles[index].properties.name, '?');
        if (roleNeeded === roles[index].properties.name) {
          return true;
        }
      }

      return false;
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
      },
      me: {
        method: 'GET',
        url: '//api.waterreporter.org/v1/data/me'
      },
      classifications: {
        method: 'GET',
        isArray: false,
        url: '//api.waterreporter.org/v1/data/user/:id/classifications'
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
                geocoding[scope.mapboxGeocoderDirection](query_).success(function(results) {
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
      batch: function() {
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
      drawGeoJSON: function(geojson, featureGroup) {

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
      drawMarker: function(marker) {
        var image = (marker.properties.images.length) ? marker.properties.images[0].properties.original : '';

        return {
          lat: marker.geometry.geometries[0].coordinates[1],
          lng: marker.geometry.geometries[0].coordinates[0],
          focus: false,
          draggable: false,
          permalink: '/reports/' + marker.id,
          icon: {
            type: 'div',
            html: '<div class="marker--icon--image marker--icon--large"><img src="' + image + '" class="" alt="Museum Garden" width="100%" /></div><span class="marker--icon--point"></span>',
            className: 'marker--icon',
            iconSize: [96, 96],
            popupAnchor: [0, -16]
          }
        };
      },
      /**
       *
       *
       */
      drawMarkers: function(geojson, featureGroup, appendToLayer) {

        var self = this;

        //
        // Should this GeoJSON object be appended to all existing Features or
        // should it replace all other objects?
        //
        // Defaults to clearing the layer and adding only the new geojsonObject
        // defined in the function arguments
        //
        if (!appendToLayer) {
          featureGroup.clearLayers();
        }

        var markers = [];

        angular.forEach(geojson.features, function(marker, $index) {

          markers[$index] = self.drawMarker(marker);

        });

        return markers;
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
      intersects: function(requestedLocation) {

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
        // var ccGeometryAPI = commonscloud.baseurl.concat(collection, '/', 'intersects', '.geojson');
        var ccGeometryAPI = null;

        //
        // Send a GET request to the Mapbox Geocoding API containing valid user
        // input
        //
        var promise = $http.get(ccGeometryAPI, {
          params: {
            'callback': 'JSON_CALLBACK',
            'geometry': requestedLocation.lng + ' ' + requestedLocation.lat
          }
        })
          .success(function(featureCollection) {
            return featureCollection;
          })
          .error(function(data) {
            console.error('CommonsCloud Geospatial API could not return any results based on your input', data, requestedLocation);
          });

        //
        // Always return Requests in angular.services as a `promise`
        //
        return promise;
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
            name: 'Streets',
            url: 'https://{s}.tiles.mapbox.com/v3/{mapid}/{z}/{x}/{y}.png',
            type: 'xyz',
            layerOptions: {
              mapid: 'developedsimple.mf7anga9'
            }
          },
          satellite: {
            name: 'Satellite',
            url: 'https://{s}.tiles.mapbox.com/v3/{mapid}/{z}/{x}/{y}.png',
            type: 'xyz',
            layerOptions: {
              mapid: 'developedsimple.mn44k8he'
            // },
            // layerOptions: {
            //   attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a>'
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
        controllerAs: 'page'
      })
      .when('/logout', {
        redirectTo: '/user/logout'
      })
      .when('/user/logout', {
        template: 'Logging out ...',
        controller: 'SecurityLogoutController',
        controllerAs: 'page'
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

          console.error('Couldn\'t save registration', error);

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
 * @ngdoc function
 * @name WaterReporter.controller:SecurityController
 * @description
 * # SecurityController
 * Controller of the WaterReporter
 */
angular.module('WaterReporter')
  .controller('SecurityLogoutController', function (Account, ipCookie, $location, $rootScope) {

    /**
     * Remove all cookies present for authentication
     */
    ipCookie.remove('WATERREPORTER_SESSION');
    ipCookie.remove('WATERREPORTER_SESSION', { path: '/' });

    ipCookie.remove('WATERREPORTER_CURRENTUSER');
    ipCookie.remove('WATERREPORTER_CURRENTUSER', { path: '/' });

    /**
     *
     */
    $rootScope.user = null;

    Account.userObject = null;

    /**
     * Redirect individuals back to the activity list
     */
    $location.path('/activity/list');
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
  .factory('SecurityInterceptor', function ($q, ipCookie, $location) {

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

        if (response.status === 403) {
          $location.path('/user/logout');
        }

        return $q.reject(response);
      }
    };
  }).config(function ($httpProvider) {
    $httpProvider.interceptors.push('SecurityInterceptor');
  });

'use strict';

/**
 * @ngdoc overview
 * @name
 * @description
 */
angular.module('exifReader', [])
    .factory('EXIF', [

        function () {

            var EXIF;

            EXIF = (function () {

                var debug = false;

                var ExifTags = {

                    // version tags
                    0x9000: "ExifVersion", // EXIF version
                    0xA000: "FlashpixVersion", // Flashpix format version

                    // colorspace tags
                    0xA001: "ColorSpace", // Color space information tag

                    // image configuration
                    0xA002: "PixelXDimension", // Valid width of meaningful image
                    0xA003: "PixelYDimension", // Valid height of meaningful image
                    0x9101: "ComponentsConfiguration", // Information about channels
                    0x9102: "CompressedBitsPerPixel", // Compressed bits per pixel

                    // user information
                    0x927C: "MakerNote", // Any desired information written by the manufacturer
                    0x9286: "UserComment", // Comments by user

                    // related file
                    0xA004: "RelatedSoundFile", // Name of related sound file

                    // date and time
                    0x9003: "DateTimeOriginal", // Date and time when the original image was generated
                    0x9004: "DateTimeDigitized", // Date and time when the image was stored digitally
                    0x9290: "SubsecTime", // Fractions of seconds for DateTime
                    0x9291: "SubsecTimeOriginal", // Fractions of seconds for DateTimeOriginal
                    0x9292: "SubsecTimeDigitized", // Fractions of seconds for DateTimeDigitized

                    // picture-taking conditions
                    0x829A: "ExposureTime", // Exposure time (in seconds)
                    0x829D: "FNumber", // F number
                    0x8822: "ExposureProgram", // Exposure program
                    0x8824: "SpectralSensitivity", // Spectral sensitivity
                    0x8827: "ISOSpeedRatings", // ISO speed rating
                    0x8828: "OECF", // Optoelectric conversion factor
                    0x9201: "ShutterSpeedValue", // Shutter speed
                    0x9202: "ApertureValue", // Lens aperture
                    0x9203: "BrightnessValue", // Value of brightness
                    0x9204: "ExposureBias", // Exposure bias
                    0x9205: "MaxApertureValue", // Smallest F number of lens
                    0x9206: "SubjectDistance", // Distance to subject in meters
                    0x9207: "MeteringMode", // Metering mode
                    0x9208: "LightSource", // Kind of light source
                    0x9209: "Flash", // Flash status
                    0x9214: "SubjectArea", // Location and area of main subject
                    0x920A: "FocalLength", // Focal length of the lens in mm
                    0xA20B: "FlashEnergy", // Strobe energy in BCPS
                    0xA20C: "SpatialFrequencyResponse", //
                    0xA20E: "FocalPlaneXResolution", // Number of pixels in width direction per FocalPlaneResolutionUnit
                    0xA20F: "FocalPlaneYResolution", // Number of pixels in height direction per FocalPlaneResolutionUnit
                    0xA210: "FocalPlaneResolutionUnit", // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
                    0xA214: "SubjectLocation", // Location of subject in image
                    0xA215: "ExposureIndex", // Exposure index selected on camera
                    0xA217: "SensingMethod", // Image sensor type
                    0xA300: "FileSource", // Image source (3 == DSC)
                    0xA301: "SceneType", // Scene type (1 == directly photographed)
                    0xA302: "CFAPattern", // Color filter array geometric pattern
                    0xA401: "CustomRendered", // Special processing
                    0xA402: "ExposureMode", // Exposure mode
                    0xA403: "WhiteBalance", // 1 = auto white balance, 2 = manual
                    0xA404: "DigitalZoomRation", // Digital zoom ratio
                    0xA405: "FocalLengthIn35mmFilm", // Equivalent foacl length assuming 35mm film camera (in mm)
                    0xA406: "SceneCaptureType", // Type of scene
                    0xA407: "GainControl", // Degree of overall image gain adjustment
                    0xA408: "Contrast", // Direction of contrast processing applied by camera
                    0xA409: "Saturation", // Direction of saturation processing applied by camera
                    0xA40A: "Sharpness", // Direction of sharpness processing applied by camera
                    0xA40B: "DeviceSettingDescription", //
                    0xA40C: "SubjectDistanceRange", // Distance to subject

                    // other tags
                    0xA005: "InteroperabilityIFDPointer",
                    0xA420: "ImageUniqueID" // Identifier assigned uniquely to each image
                };

                var TiffTags = {
                    0x0100: "ImageWidth",
                    0x0101: "ImageHeight",
                    0x8769: "ExifIFDPointer",
                    0x8825: "GPSInfoIFDPointer",
                    0xA005: "InteroperabilityIFDPointer",
                    0x0102: "BitsPerSample",
                    0x0103: "Compression",
                    0x0106: "PhotometricInterpretation",
                    0x0112: "Orientation",
                    0x0115: "SamplesPerPixel",
                    0x011C: "PlanarConfiguration",
                    0x0212: "YCbCrSubSampling",
                    0x0213: "YCbCrPositioning",
                    0x011A: "XResolution",
                    0x011B: "YResolution",
                    0x0128: "ResolutionUnit",
                    0x0111: "StripOffsets",
                    0x0116: "RowsPerStrip",
                    0x0117: "StripByteCounts",
                    0x0201: "JPEGInterchangeFormat",
                    0x0202: "JPEGInterchangeFormatLength",
                    0x012D: "TransferFunction",
                    0x013E: "WhitePoint",
                    0x013F: "PrimaryChromaticities",
                    0x0211: "YCbCrCoefficients",
                    0x0214: "ReferenceBlackWhite",
                    0x0132: "DateTime",
                    0x010E: "ImageDescription",
                    0x010F: "Make",
                    0x0110: "Model",
                    0x0131: "Software",
                    0x013B: "Artist",
                    0x8298: "Copyright"
                };

                var GPSTags = {
                    0x0000: "GPSVersionID",
                    0x0001: "GPSLatitudeRef",
                    0x0002: "GPSLatitude",
                    0x0003: "GPSLongitudeRef",
                    0x0004: "GPSLongitude",
                    0x0005: "GPSAltitudeRef",
                    0x0006: "GPSAltitude",
                    0x0007: "GPSTimeStamp",
                    0x0008: "GPSSatellites",
                    0x0009: "GPSStatus",
                    0x000A: "GPSMeasureMode",
                    0x000B: "GPSDOP",
                    0x000C: "GPSSpeedRef",
                    0x000D: "GPSSpeed",
                    0x000E: "GPSTrackRef",
                    0x000F: "GPSTrack",
                    0x0010: "GPSImgDirectionRef",
                    0x0011: "GPSImgDirection",
                    0x0012: "GPSMapDatum",
                    0x0013: "GPSDestLatitudeRef",
                    0x0014: "GPSDestLatitude",
                    0x0015: "GPSDestLongitudeRef",
                    0x0016: "GPSDestLongitude",
                    0x0017: "GPSDestBearingRef",
                    0x0018: "GPSDestBearing",
                    0x0019: "GPSDestDistanceRef",
                    0x001A: "GPSDestDistance",
                    0x001B: "GPSProcessingMethod",
                    0x001C: "GPSAreaInformation",
                    0x001D: "GPSDateStamp",
                    0x001E: "GPSDifferential"
                };

                var StringValues = {
                    ExposureProgram: {
                        0: "Not defined",
                        1: "Manual",
                        2: "Normal program",
                        3: "Aperture priority",
                        4: "Shutter priority",
                        5: "Creative program",
                        6: "Action program",
                        7: "Portrait mode",
                        8: "Landscape mode"
                    },
                    MeteringMode: {
                        0: "Unknown",
                        1: "Average",
                        2: "CenterWeightedAverage",
                        3: "Spot",
                        4: "MultiSpot",
                        5: "Pattern",
                        6: "Partial",
                        255: "Other"
                    },
                    LightSource: {
                        0: "Unknown",
                        1: "Daylight",
                        2: "Fluorescent",
                        3: "Tungsten (incandescent light)",
                        4: "Flash",
                        9: "Fine weather",
                        10: "Cloudy weather",
                        11: "Shade",
                        12: "Daylight fluorescent (D 5700 - 7100K)",
                        13: "Day white fluorescent (N 4600 - 5400K)",
                        14: "Cool white fluorescent (W 3900 - 4500K)",
                        15: "White fluorescent (WW 3200 - 3700K)",
                        17: "Standard light A",
                        18: "Standard light B",
                        19: "Standard light C",
                        20: "D55",
                        21: "D65",
                        22: "D75",
                        23: "D50",
                        24: "ISO studio tungsten",
                        255: "Other"
                    },
                    Flash: {
                        0x0000: "Flash did not fire",
                        0x0001: "Flash fired",
                        0x0005: "Strobe return light not detected",
                        0x0007: "Strobe return light detected",
                        0x0009: "Flash fired, compulsory flash mode",
                        0x000D: "Flash fired, compulsory flash mode, return light not detected",
                        0x000F: "Flash fired, compulsory flash mode, return light detected",
                        0x0010: "Flash did not fire, compulsory flash mode",
                        0x0018: "Flash did not fire, auto mode",
                        0x0019: "Flash fired, auto mode",
                        0x001D: "Flash fired, auto mode, return light not detected",
                        0x001F: "Flash fired, auto mode, return light detected",
                        0x0020: "No flash function",
                        0x0041: "Flash fired, red-eye reduction mode",
                        0x0045: "Flash fired, red-eye reduction mode, return light not detected",
                        0x0047: "Flash fired, red-eye reduction mode, return light detected",
                        0x0049: "Flash fired, compulsory flash mode, red-eye reduction mode",
                        0x004D: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
                        0x004F: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
                        0x0059: "Flash fired, auto mode, red-eye reduction mode",
                        0x005D: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
                        0x005F: "Flash fired, auto mode, return light detected, red-eye reduction mode"
                    },
                    SensingMethod: {
                        1: "Not defined",
                        2: "One-chip color area sensor",
                        3: "Two-chip color area sensor",
                        4: "Three-chip color area sensor",
                        5: "Color sequential area sensor",
                        7: "Trilinear sensor",
                        8: "Color sequential linear sensor"
                    },
                    SceneCaptureType: {
                        0: "Standard",
                        1: "Landscape",
                        2: "Portrait",
                        3: "Night scene"
                    },
                    SceneType: {
                        1: "Directly photographed"
                    },
                    CustomRendered: {
                        0: "Normal process",
                        1: "Custom process"
                    },
                    WhiteBalance: {
                        0: "Auto white balance",
                        1: "Manual white balance"
                    },
                    GainControl: {
                        0: "None",
                        1: "Low gain up",
                        2: "High gain up",
                        3: "Low gain down",
                        4: "High gain down"
                    },
                    Contrast: {
                        0: "Normal",
                        1: "Soft",
                        2: "Hard"
                    },
                    Saturation: {
                        0: "Normal",
                        1: "Low saturation",
                        2: "High saturation"
                    },
                    Sharpness: {
                        0: "Normal",
                        1: "Soft",
                        2: "Hard"
                    },
                    SubjectDistanceRange: {
                        0: "Unknown",
                        1: "Macro",
                        2: "Close view",
                        3: "Distant view"
                    },
                    FileSource: {
                        3: "DSC"
                    },

                    Components: {
                        0: "",
                        1: "Y",
                        2: "Cb",
                        3: "Cr",
                        4: "R",
                        5: "G",
                        6: "B"
                    }
                };

                function addEvent(element, event, handler) {
                    if (element.addEventListener) {
                        element.addEventListener(event, handler, false);
                    } else if (element.attachEvent) {
                        element.attachEvent("on" + event, handler);
                    }
                }

                function imageHasData(img) {
                    return !!(img.exifdata);
                }


                function base64ToArrayBuffer(base64, contentType) {
                    contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
                    base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
                    var binary = atob(base64);
                    var len = binary.length;
                    var buffer = new ArrayBuffer(len);
                    var view = new Uint8Array(buffer);
                    for (var i = 0; i < len; i++) {
                        view[i] = binary.charCodeAt(i);
                    }
                    return buffer;
                }

                function objectURLToBlob(url, callback) {
                    var http = new XMLHttpRequest();
                    http.open("GET", url, true);
                    http.responseType = "blob";
                    http.onload = function (e) {
                        if (this.status == 200 || this.status === 0) {
                            callback(this.response);
                        }
                    };
                    http.send();
                }

                function getImageData(img, callback) {
                    function handleBinaryFile(binFile) {
                        var data = findEXIFinJPEG(binFile);
                        img.exifdata = data || {};
                        if (callback) {
                            callback.call(img);
                        }
                    }

                    if (img instanceof Image || img instanceof HTMLImageElement) {
                        if (/^data\:/i.test(img.src)) { // Data URI
                            var arrayBuffer = base64ToArrayBuffer(img.src);
                            handleBinaryFile(arrayBuffer);

                        } else if (/^blob\:/i.test(img.src)) { // Object URL
                            var fileReader = new FileReader();
                            fileReader.onload = function (e) {
                                handleBinaryFile(e.target.result);
                            };
                            objectURLToBlob(img.src, function (blob) {
                                fileReader.readAsArrayBuffer(blob);
                            });
                        } else {
                            var http = new XMLHttpRequest();
                            http.onload = function () {
                                if (http.status == "200") {
                                    handleBinaryFile(http.response);
                                } else {
                                    throw "Could not load image";
                                }
                                http = null;
                            };
                            http.open("GET", img.src, true);
                            http.responseType = "arraybuffer";
                            http.send(null);
                        }
                    } else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
                        var fileReader = new FileReader();
                        fileReader.onload = function (e) {
                            if (debug) console.log("Got file of length " + e.target.result.byteLength);
                            handleBinaryFile(e.target.result);
                        };

                        fileReader.readAsArrayBuffer(img);
                    }
                }

                function findEXIFinJPEG(file) {
                    var dataView = new DataView(file);

                    if (debug) console.log("Got file of length " + file.byteLength);
                    if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
                        if (debug) console.log("Not a valid JPEG");
                        return false; // not a valid jpeg
                    }

                    var offset = 2,
                        length = file.byteLength,
                        marker;

                    while (offset < length) {
                        if (dataView.getUint8(offset) != 0xFF) {
                            if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
                            return false; // not a valid marker, something is wrong
                        }

                        marker = dataView.getUint8(offset + 1);
                        if (debug) console.log(marker);

                        // we could implement handling for other markers here,
                        // but we're only looking for 0xFFE1 for EXIF data

                        if (marker == 225) {
                            if (debug) console.log("Found 0xFFE1 marker");

                            return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

                            // offset += 2 + file.getShortAt(offset+2, true);

                        } else {
                            offset += 2 + dataView.getUint16(offset + 2);
                        }

                    }

                }


                function readTags(file, tiffStart, dirStart, strings, bigEnd) {
                    var entries = file.getUint16(dirStart, !bigEnd),
                        tags = {},
                        entryOffset, tag,
                        i;

                    for (i = 0; i < entries; i++) {
                        entryOffset = dirStart + i * 12 + 2;
                        tag = strings[file.getUint16(entryOffset, !bigEnd)];
                        if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
                        tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
                    }
                    return tags;
                }


                function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
                    var type = file.getUint16(entryOffset + 2, !bigEnd),
                        numValues = file.getUint32(entryOffset + 4, !bigEnd),
                        valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart,
                        offset,
                        vals, val, n,
                        numerator, denominator;

                    switch (type) {
                    case 1: // byte, 8-bit unsigned int
                    case 7: // undefined, 8-bit byte, value depending on field
                        if (numValues == 1) {
                            return file.getUint8(entryOffset + 8, !bigEnd);
                        } else {
                            offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                            vals = [];
                            for (n = 0; n < numValues; n++) {
                                vals[n] = file.getUint8(offset + n);
                            }
                            return vals;
                        }

                    case 2: // ascii, 8-bit byte
                        offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                        return getStringFromDB(file, offset, numValues - 1);

                    case 3: // short, 16 bit int
                        if (numValues == 1) {
                            return file.getUint16(entryOffset + 8, !bigEnd);
                        } else {
                            offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                            vals = [];
                            for (n = 0; n < numValues; n++) {
                                vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
                            }
                            return vals;
                        }

                    case 4: // long, 32 bit int
                        if (numValues == 1) {
                            return file.getUint32(entryOffset + 8, !bigEnd);
                        } else {
                            vals = [];
                            for (n = 0; n < numValues; n++) {
                                vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
                            }
                            return vals;
                        }

                    case 5: // rational = two long values, first is numerator, second is denominator
                        if (numValues == 1) {
                            numerator = file.getUint32(valueOffset, !bigEnd);
                            denominator = file.getUint32(valueOffset + 4, !bigEnd);
                            val = new Number(numerator / denominator);
                            val.numerator = numerator;
                            val.denominator = denominator;
                            return val;
                        } else {
                            vals = [];
                            for (n = 0; n < numValues; n++) {
                                numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
                                denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
                                vals[n] = new Number(numerator / denominator);
                                vals[n].numerator = numerator;
                                vals[n].denominator = denominator;
                            }
                            return vals;
                        }

                    case 9: // slong, 32 bit signed int
                        if (numValues == 1) {
                            return file.getInt32(entryOffset + 8, !bigEnd);
                        } else {
                            vals = [];
                            for (n = 0; n < numValues; n++) {
                                vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
                            }
                            return vals;
                        }

                    case 10: // signed rational, two slongs, first is numerator, second is denominator
                        if (numValues == 1) {
                            return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd);
                        } else {
                            vals = [];
                            for (n = 0; n < numValues; n++) {
                                vals[n] = file.getInt32(valueOffset + 8 * n, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
                            }
                            return vals;
                        }
                    }
                }

                function getStringFromDB(buffer, start, length) {
                    var outstr = "";
                    for (var n = start; n < start + length; n++) {
                        outstr += String.fromCharCode(buffer.getUint8(n));
                    }
                    return outstr;
                }

                function readEXIFData(file, start) {
                    if (getStringFromDB(file, start, 4) != "Exif") {
                        if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
                        return false;
                    }

                    var bigEnd,
                        tags, tag,
                        exifData, gpsData,
                        tiffOffset = start + 6;

                    // test for TIFF validity and endianness
                    if (file.getUint16(tiffOffset) == 0x4949) {
                        bigEnd = false;
                    } else if (file.getUint16(tiffOffset) == 0x4D4D) {
                        bigEnd = true;
                    } else {
                        if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
                        return false;
                    }

                    if (file.getUint16(tiffOffset + 2, !bigEnd) != 0x002A) {
                        if (debug) console.log("Not valid TIFF data! (no 0x002A)");
                        return false;
                    }

                    var firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);

                    if (firstIFDOffset < 0x00000008) {
                        if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset + 4, !bigEnd));
                        return false;
                    }

                    tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

                    if (tags.ExifIFDPointer) {
                        exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
                        for (tag in exifData) {
                            switch (tag) {
                            case "LightSource":
                            case "Flash":
                            case "MeteringMode":
                            case "ExposureProgram":
                            case "SensingMethod":
                            case "SceneCaptureType":
                            case "SceneType":
                            case "CustomRendered":
                            case "WhiteBalance":
                            case "GainControl":
                            case "Contrast":
                            case "Saturation":
                            case "Sharpness":
                            case "SubjectDistanceRange":
                            case "FileSource":
                                exifData[tag] = StringValues[tag][exifData[tag]];
                                break;

                            case "ExifVersion":
                            case "FlashpixVersion":
                                exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                                break;

                            case "ComponentsConfiguration":
                                exifData[tag] =
                                    StringValues.Components[exifData[tag][0]] +
                                    StringValues.Components[exifData[tag][1]] +
                                    StringValues.Components[exifData[tag][2]] +
                                    StringValues.Components[exifData[tag][3]];
                                break;
                            }
                            tags[tag] = exifData[tag];
                        }
                    }

                    if (tags.GPSInfoIFDPointer) {
                        gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
                        for (tag in gpsData) {
                            switch (tag) {
                            case "GPSVersionID":
                                gpsData[tag] = gpsData[tag][0] +
                                    "." + gpsData[tag][1] +
                                    "." + gpsData[tag][2] +
                                    "." + gpsData[tag][3];
                                break;
                            }
                            tags[tag] = gpsData[tag];
                        }
                    }

                    return tags;
                }


                function getData(img, callback) {
                    if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) return false;

                    if (!imageHasData(img)) {
                        getImageData(img, callback);
                    } else {
                        if (callback) {
                            callback.call(img);
                        }
                    }
                    return true;
                }

                function getTag(img, tag) {
                    if (!imageHasData(img)) return;
                    return img.exifdata[tag];
                }

                function getAllTags(img) {
                    if (!imageHasData(img)) return {};
                    var a,
                        data = img.exifdata,
                        tags = {};
                    for (a in data) {
                        if (data.hasOwnProperty(a)) {
                            tags[a] = data[a];
                        }
                    }
                    return tags;
                }

                function pretty(img) {
                    if (!imageHasData(img)) return "";
                    var a,
                        data = img.exifdata,
                        strPretty = "";
                    for (a in data) {
                        if (data.hasOwnProperty(a)) {
                            if (typeof data[a] == "object") {
                                if (data[a] instanceof Number) {
                                    strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                                } else {
                                    strPretty += a + " : [" + data[a].length + " values]\r\n";
                                }
                            } else {
                                strPretty += a + " : " + data[a] + "\r\n";
                            }
                        }
                    }
                    return strPretty;
                }

                function readFromBinaryFile(file) {
                    return findEXIFinJPEG(file);
                }


                return {
                    readFromBinaryFile: readFromBinaryFile,
                    pretty: pretty,
                    getTag: getTag,
                    getAllTags: getAllTags,
                    getData: getData,

                    Tags: ExifTags,
                    TiffTags: TiffTags,
                    GPSTags: GPSTags,
                    StringValues: StringValues
                };

            })();

            return EXIF;

        }
    ]);

'use strict';

/**
 * @ngdoc overview
 * @name
 * @description
 */
angular.module('WaterReporter')
    .directive('imageLoader',
        function (EXIF) {
            return {
                restrict: 'EA',
                scope: {
                    data: '='
                },
                link: function (scope, element) {

                    scope.render = function (url) {

                        if (!url) {
                          return;
                        }

                        var image = new Image();

                        image.completedPercentage = 0;

                        var http = new XMLHttpRequest();
                        http.open('GET', url, true);
                        http.responseType = 'blob';
                        http.onload = function (e) {
                            if (this.status === 200) {
                                image.src = URL.createObjectURL(http.response);

                                image.onload = function () {
                                    EXIF.getData(image, function () {

                                        var o = EXIF.getTag(this, 'Orientation');

                                        switch (o) {
                                          case 3:
                                              element.addClass('flip-vertical');
                                              break;
                                          case 6:
                                              element.addClass('rotate-right');
                                              break;
                                        }

                                    });
                                };
                                //image.src = URL.createObjectURL(http.response);
                                element.attr('src', image.src);

                            }
                        };

                        http.onprogress = function (e) {
                            if (e.lengthComputable) {
                                image.completedPercentage = parseInt((e.loaded / e.total) * 100);
                            }
                        };

                        http.onloadstart = function () {
                            // Display your progress bar here, starting at 0
                            image.completedPercentage = 0;
                        };

                        http.onloadend = function () {
                            // You can also remove your progress bar here, if you like.
                            image.completedPercentage = 100;
                            //angular.element('.stencil').hide();
                            angular.element('.report-card').addClass('on-deck');
                        };

                        http.send();

                    };

                    scope.$watch('data', function (new_url) {
                        return scope.render(new_url);
                    }, true);
                }
            };

        });

'use strict';

/**
 * @ngdoc overview
 * @name
 * @description
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/search', {
        templateUrl: '/modules/components/search/search--view.html',
        controller: 'SearchController',
        controllerAs: 'page',
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
          },
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
          }
        }
      });
  });

'use strict';

/**
 * @ngdoc function
 * @name
 * @description
 */
angular.module('WaterReporter')
  .controller('SearchController', function (Account, Report, reports, $rootScope, Search, user) {

    var self = this;

    $rootScope.user = Account.userObject;

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

    this.search.hidden = true;

    this.search.model = {
      report_description: {
        name: 'report_description',
        op: 'ilike',
        val: ''
      }
    };

    this.search.resource = Report;

    this.search.data = reports;

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
     * Public Functions and Variables for the Search Service
     */
     var service;

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
       filters: function() {
         service = this;

         var params = service.params,
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
       },
       clear: function() {
        $location.search('');
        $route.reload();
       },
       redirect: function() {
         this.filters();
         $location.path('/search');
       },
       execute: function(append) {

          //
          // Load our filters
          //
          this.filters();

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

        element.bind('scroll', function() {
          if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
            scope.$apply(attrs.searchScrollToLoad);
          }
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
 * @name WaterReporter.activity.config:activity-routes
 * @description
 *     Routes for the states applying to the activity feed page of the application.
 */

angular.module('WaterReporter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/activity', {
        templateUrl: '/modules/components/activity/activity--view.html',
        controller: 'ActivityController',
        controllerAs: 'page',
        reloadOnSearch: false,
        resolve: {
          features: function(Report) {
            //
            // Execute our query so that we can get the Reports back
            //
            return Report.query({
              q: {
                filters: [
                  {
                    name: 'is_featured',
                    op: 'eq',
                    val: 'true'
                  }
                ],
                order_by: [
                  {
                    field: 'report_date',
                    direction: 'desc'
                  }
                ]
              }
            });
          },
          reports: function($location, Report) {
            //
            // Execute our query so that we can get the Reports back
            //
            return Report.query({
              q: {
                order_by: [
                  {
                    field: 'report_date',
                    direction: 'desc'
                  }
                ]
              },
              page: $location.search().page ? $location.search().page : 1
            });
          },
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
          }
        }
      });
  });

'use strict';

/**
 * @ngdoc function
 * @name
 * @description
 */
angular.module('WaterReporter')
  .controller('ActivityController', function (Account, features, $location, leafletData, Map, mapbox, mapboxGeometry, Report, reports, $rootScope, $scope, Search, user) {

    var self = this;

    $rootScope.user = Account.userObject;

    /**
     * Setup our Features so that they appear on the home page in the
     * appropriate position
     */
    this.features = features;

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

    this.search.data = reports;

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

    self.features.$promise.then(function(reports_) {
        self.map.geojson.reports = {
            data: reports_
        };

        //
        // Define a layer to add geometries to later
        //
        // @see http://leafletjs.com/reference.html#featuregroup
        //
        var featureGroup = new L.FeatureGroup();

        self.map.markers = mapboxGeometry.drawMarkers(self.map.geojson.reports.data, featureGroup);

        //
        // Define the first/newest Feature and center the map on it
        //
        self.changeFeature(self.map.geojson.reports.data.features[0], 0);

        leafletData.getMap().then(function() {
          $scope.$on('leafletDirectiveMarker.click', function(event, args) {
            $location.path(self.map.markers[args.modelName].permalink);
          });
        });

     });

    this.changeFeature = function(feature, index) {

      self.features.visible = index;

      var center = {
        lat: feature.geometry.geometries[0].coordinates[1],
        lng: feature.geometry.geometries[0].coordinates[0]
      };

      self.map.center = {
        lat: center.lat,
        lng: center.lng,
        zoom: 16
      };

    };

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
        controllerAs: 'page',
        resolve: {
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
          }
        }
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
  .controller('HomeController', function (Account, Report, Search, user) {

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
      .when('/profiles/:userId', {
        templateUrl: '/modules/components/profile/profile--view.html',
        controller: 'ProfileController',
        controllerAs: 'page',
        resolve: {
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
          },
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
                ],
                order_by: [
                  {
                    field: 'report_date',
                    direction: 'desc'
                  }
                ]
              }
            };

            return Report.query(search_params);
          },
          submissions: function($location, $route, Report) {

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
  .controller('ProfilesController', function (profiles, Search) {

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
  .controller('ProfileController', function (Account, closures, leafletData, $location, Map, mapbox, mapboxGeometry, organizations, profile, Report, $rootScope, $route, Search, submissions, $scope, user) {

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
    self.search = Search;

    self.search.model = {
      report_description: {
        name: 'report_description',
        op: 'ilike',
        val: ''
      }
    };

    self.search.resource = Report;

    //
    // Load other data
    //
    this.data = profile;

    this.organizations = organizations;

    this.submissions = submissions;

    this.closures = closures;

    this.visible = {
      submissions: true,
      reports: false,
      closures: false
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

    self.submissions.$promise.then(function(reports_) {
        self.map.geojson.reports = {
            data: reports_
        };

        //
        // Define a layer to add geometries to later
        //
        // @see http://leafletjs.com/reference.html#featuregroup
        //
        var featureGroup = new L.FeatureGroup();

        self.map.markers = mapboxGeometry.drawMarkers(self.map.geojson.reports.data, featureGroup);

        //
        // Define the first/newest Feature and center the map on it
        //
        self.changeFeature(self.map.geojson.reports.data.features[0], 0);

        leafletData.getMap().then(function() {
          $scope.$on('leafletDirectiveMarker.click', function(event, args) {
            $location.path(self.map.markers[args.modelName].permalink);
          });
        });

     });

    this.changeFeature = function(feature, index) {

      var center = {
        lat: feature.geometry.geometries[0].coordinates[1],
        lng: feature.geometry.geometries[0].coordinates[0]
      };

      self.map.center = {
        lat: center.lat,
        lng: center.lng,
        zoom: 16
      };

    };

    /**
     * Load the dashboard with the appropriate User-specific reports
     */
    self.loadDashboard = function () {

      //
      // Prepare any pre-filters to append to any of our user-defined
      // filters in the browser address bar
      //
      var search_params = {
        q: {
          filters: [],
          order_by: [
            {
              field: 'report_date',
              direction: 'desc'
            }
          ]
        }
      };

      angular.forEach(Account.userObject.properties.classifications, function(value) {
        var classification = value.properties,
            fieldName = 'territory__huc_' + classification.digits + '_name',
            filter = {
              name: fieldName,
              op: 'has',
              val: classification.name
            };

        search_params.q.filters.push(filter);

        // We need to dyamically define the model for this since the fieldName
        // is variable

        // We need to manually add the param to the classifications
        // self.search.params[fieldName] = classification.name;
      });

      //
      // Execute our query so that we can get the Reports back
      //
      self.reports = Report.query(search_params);
    };


    //
    // This is the first page the authneticated user will see. We need to make
    // sure that their user information is ready to use. Make sure the
    // Account.userObject contains the appropriate information.
    //
    if (Account.userObject && !Account.userObject.id) {
      if (user) {
        user.$promise.then(function(userResponse) {
          Account.userObject = userResponse;
            $rootScope.user = Account.userObject;

            $rootScope.isLoggedIn = Account.hasToken();
            $rootScope.isAdmin = Account.hasRole('admin');
            $rootScope.isCurrentUser = ($rootScope.user.id === parseInt($route.current.params.userId)) ? true : false;

            self.visible.reports = ($rootScope.isCurrentUser) ? true : false;
            self.visible.submissions = ($rootScope.isCurrentUser) ? false : true;

            if ($rootScope.isAdmin) {
              self.loadDashboard();
            }
            else {
              $location.path('/activity/list');
            }
        });
      }
    }

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
        controllerAs: 'page',
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
          },
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
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
  .controller('ReportController', function (Account, comments, Comment, leafletData, Map, mapbox, mapboxGeometry, $location, $rootScope, report, Report, $route, Search, user) {

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

    report.$promise.then(function(reportResponse) {

      self.report = reportResponse;

      //
      // Now that we have the Report fully loaded into the page we can request
      // additional posts by this user
      //
      if (self.report.properties.owner_id) {
        self.otherReports(self.report.properties.owner_id);
      }

      /**
       * Setup Pinterest Rich Pins `<meta>` tags. Each of our Report objects
       * will their own Pinterest Rich Pins page
       *
       * @see https://developers.pinterest.com/rich_pins_place/
       */
      var watershed = (self.report.properties.territory) ? ' in the ' + self.report.properties.territory.properties.huc_8_name + ' Watershed': '';

      $rootScope.meta = {
        og: {
          site_name: 'WaterReporter',
          title: 'Citizen Water Report' + watershed,
          type: 'place',
          description: (self.report.properties.report_description) ? self.report.properties.report_description: 'A report in the ' + self.report.properties.territory.properties.huc_8_name + ' watershed',
          url: 'https://www.waterreporter.org/reports/' + self.report.id
        },
        place: {
          location: {
            longitude: (self.report.geometry.geometries.length) ? self.report.geometry.geometries[0].coordinates[1] : null,
            latitude: (self.report.geometry.geometries.length) ? self.report.geometry.geometries[0].coordinates[0] : null
          }
        }
      };

      //
      // Define a layer to add geometries to later
      //
      // @see http://leafletjs.com/reference.html#featuregroup
      //
      var featureGroup = new L.FeatureGroup();

      self.map.markers = [mapboxGeometry.drawMarker(self.report, featureGroup)];

      //
      // Define the first/newest Feature and center the map on it
      //
      self.changeFeature(reportResponse, 0);
    });

    self.comments = comments;

    self.otherReports = function(userId) {

      if (!userId) {
        return;
      }

      var params = {
        q: {
          filters: [
            {
              name: 'owner_id',
              op: 'eq',
              val: userId
            },
            {
              name: 'id',
              op: 'neq',
              val: $route.current.params.reportId
            }
          ],
          order_by: [
            {
              field: 'report_date',
              direction: 'desc'
            }
          ],
          limit: 2
        }
      };

      Report.query(params).$promise.then(function(reportResponse) {
        console.log('reportResponse.features', reportResponse.features)
        self.other = {
          reports: reportResponse.features
        };
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
            $route.reload();
          });
       },
       delete: function(commentId) {
        Comment.delete({
          id: commentId
        }).$promise.then(function() {
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
         }).$promise.then(function() {
           $route.reload();
         });
       },
       open: function(reportId) {

        // Save the Comment
        self.comment.save(reportId, 'open');

        // Close the Reprot
         Report.close({
          id: reportId,
          state: 'open'
         }).$promise.then(function() {
           $route.reload();
         });
       },
       save: function(reportId, state) {

        var comment = new Comment({
          body: self.comment.data.body,
          status: 'public',
          report_id: reportId,
          report_state: (state) ? state : null
        });

        comment.$save(function() {
          $route.reload();
        });
       }
      };

     self.delete = function(reportId) {
       Report.delete({
         id: reportId
       }).$promise.then(function() {
         $location.path('/activity/list');
       });
     };

     self.changeFeature = function(feature) {

       var center = {
         lat: feature.geometry.geometries[0].coordinates[1],
         lng: feature.geometry.geometries[0].coordinates[0]
       };

       self.map.center = {
         lat: center.lat,
         lng: center.lng,
         zoom: 16
       };

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