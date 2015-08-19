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
    'ngTouch',
    'leaflet-directive',
    'angularMoment',
    'igTruncate',
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

    Account.getUser = function() {

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
    return $resource('//api.waterreporter.org/v1/media/image/:imageId', {}, {
      query: {
        isArray: false
      },
      upload: {
        method: 'POST',
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      },
      update: {
        method: 'PATCH'
      },
      delete: {
        method: 'DELETE',
        url: '//api.waterreporter.org/v1/data/image/:imageId'
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

(function() {

  'use strict';

  angular.module('WaterReporter')
    .directive('number', function() {
  	return {
  		restrict: 'A',
  		link: function(scope, element){

        var disable = function () {
  				element[0].blur();
  			};

  			element.bind('mousewheel', disable);
  		}
  	};
  });

}());

angular.module('igTruncate', []).filter('truncate', function (){
  return function (text, length, end){
    if (text !== undefined){
      if (isNaN(length)){
        length = 10;
      }

      if (end === undefined){
        end = "...";
      }

      if (text.length <= length || text.length - end.length <= length){
        return text;
      }else{
        return String(text).substring(0, length - end.length) + end;
      }
    }
  };
});

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
        var image = (marker.properties.images.length && marker.properties.images[0].properties.icon_retina) ? marker.properties.images[0].properties.icon_retina : marker.properties.images[0].properties.original,
            _unresolved_html = '<div class="marker--icon--image marker--icon--large"><img src="' + image + '" class="" alt="" width="100%" /></div><span class="marker--icon--point"></span>',
            _resolved_html = '<div class="marker--icon--image marker--icon--large"><img src="/images/badget--CertifiedAction--Small--ClosedBlue.svg" class="" alt="" width="70%" /></div><span class="marker--icon--point"></span>';

        return {
          lat: marker.geometry.geometries[0].coordinates[1],
          lng: marker.geometry.geometries[0].coordinates[0],
          focus: false,
          draggable: false,
          permalink: '/reports/' + marker.id,
          icon: {
            type: 'div',
            html: (marker.properties.state === 'closed') ? _resolved_html : _unresolved_html,
            className: (marker.properties.state === 'closed') ? 'marker--icon marker--icon--resolved' : 'marker--icon',
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
            }
          }
        }
      },
      center: {
        lng: -77.534,
        lat: 40.834,
        zoom: 7
      },
      markers: {
        //  reportGeometry: {
        //    lng: -77.534,
        //    lat: 40.834,
        //    message: 'Drag me to your report location',
        //    focus: true,
        //    draggable: true
        //  }
       },
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
      geojson: {},
      toggleControls: function(toggle) {

        var controls = document.getElementsByClassName('leaflet-control-container'),
            index;

        if (toggle === 'show') {
          for(index = 0; index < controls.length; ++index){
            controls[index].setAttribute('class', 'leaflet-control-container leaflet-control-container-visible');
          }
        } else {
          for(index = 0; index < controls.length; ++index){
            controls[index].setAttribute('class', 'leaflet-control-container');
          }
        }
      }
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
            //
            // Make sure our cookies for the Session are being set properly
            //
            ipCookie.remove('WATERREPORTER_SESSION');
            ipCookie('WATERREPORTER_SESSION', response.access_token, self.cookieOptions);

            //
            // Make sure we also set the User ID Cookie, so we need to wait to
            // redirect until we're really sure the cookie is set
            //
            Account.setUserId().$promise.then(function() {
              Account.getUser().$promise.then(function(userResponse) {

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
        return $q.reject(response);
      }
    };
  }).config(function ($httpProvider) {
    $httpProvider.interceptors.push('SecurityInterceptor');
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
  .directive('fileModel', function ($parse) {
      return {
          restrict: 'A',
          link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;

              element.bind('change', function(){
                  scope.$apply(function(){
                      modelSetter(scope, element[0].files[0]);
                  });
              });
          }
      };
  });

(function() {

  'use strict';

  /**
   * @ngdoc service
   * @name
   * @description
   */
  angular.module('WaterReporter')
    .service('Exporter', function() {

      var _private = {};

      var _public = {
        /**
         * Create a CSV file structure from a GeoJSON Blob
         *
         * @param (object) geoJsonObject
         *
         * @return (object) csvFile
         */
        geojsonToCsv: function (geoJsonObject) {


          var date = new Date().toISOString(),
              filename = 'WaterReporter--ReportsSearch' + date + '.csv',
              rows = [];

          //
          // Create the CSV Header
          //
          var header = [
            'date',
            'report_state',
            'comment',
            'image',
            'owner',
            'title',
            'organization',
            'huc_6_name',
            'huc_6_code',
            'huc_8_name',
            'huc_8_code',
            'huc_10_name',
            'huc_10_code',
            'huc_12_name',
            'huc_12_code',
            'longitude',
            'latitude'
          ];

          rows.push(header.join(', '));

          //
          // Create the individual Rows
          //
          angular.forEach(geoJsonObject.features, function(feature) {

            console.log('feature', feature);

            var row = [
              feature.properties.report_date,
              feature.properties.state,
              (feature.properties.report_description) ? feature.properties.report_description.replace(/ /g, '%20').replace(/,/g, ' ') : '',
              ((feature.properties.images.length) ? feature.properties.images[0].properties.original : ''),
              ((feature.properties.owner) ? feature.properties.owner.properties.first_name + '%20' + feature.properties.owner.properties.last_name : ''),
              ((feature.properties.owner && feature.properties.owner.properties.title) ? feature.properties.owner.properties.title.replace(/ /g, '%20').replace(/,/g, ' ') : ''),
              ((feature.properties.owner && feature.properties.owner.properties.organization_name) ? feature.properties.owner.properties.organization_name.replace(/ /g, '%20').replace(/,/g, ' ') : ''),
              ((feature.properties.territory) ? feature.properties.territory.properties.huc_6_name : ''),
              ((feature.properties.territory) ? feature.properties.territory.properties.huc_6_code : ''),
              ((feature.properties.territory) ? feature.properties.territory.properties.huc_8_name : ''),
              ((feature.properties.territory) ? feature.properties.territory.properties.huc_8_code : ''),
              ((feature.properties.territory) ? feature.properties.territory.properties.huc_10_name : ''),
              ((feature.properties.territory) ? feature.properties.territory.properties.huc_10_code : ''),
              ((feature.properties.territory) ? feature.properties.territory.properties.huc_12_name : ''),
              ((feature.properties.territory) ? feature.properties.territory.properties.huc_12_code : ''),
              feature.geometry.geometries[0].coordinates[1],
              feature.geometry.geometries[0].coordinates[0]
            ];

            rows.push(row.join(', '));
          });

          var a         = document.createElement('a');
          a.href        = 'data:attachment/csv,' + rows.join('%0A');
          a.target      = '_blank';
          a.download    = filename;

          document.body.appendChild(a);
          a.click();
        }
      };

      return _public;
    });


} ());

'use strict';

/**
 * @ngdoc service
 * @name
 * @description
 */
angular.module('WaterReporter')
  .service('Notifications', function Notifications($rootScope, $timeout) {

    $rootScope.notifications = {
      objects: [],
      success: function(alertTitle, alertMessage) { // kwargs in this context should be an
        $rootScope.notifications.objects.push({
          type: 'success',
          title: (alertTitle) ? alertTitle : 'Great!',
          message: (alertMessage) ? alertMessage : 'Your updates were saved.'
        });
      },
      info: function(alertTitle, alertMessage) {
        $rootScope.notifications.objects.push({
          type: 'info',
          title: (alertTitle) ? alertTitle : '',
          message: (alertMessage) ? alertMessage : ''
        });
      },
      warning: function(alertTitle, alertMessage) {
        $rootScope.notifications.objects.push({
          type: 'warning',
          title: (alertTitle) ? alertTitle : 'Warning!',
          message: (alertMessage) ? alertMessage : ''
        });
      },
      error: function(alertTitle, alertMessage) {
        $rootScope.notifications.objects.push({
          type: 'error',
          title: (alertTitle) ? alertTitle : 'Uh-oh!',
          message: (alertMessage) ? alertMessage : 'We couldn\'t save your changes.'
        });
      },
      dismiss: function($index) {
        $timeout(function() {
          $rootScope.notifications.objects.splice($index, 1);
        }, 5000);
      },
      dismissAll: function() {
        $rootScope.notifications.objects = [];
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
  .controller('SearchController', function (Account, Exporter, $location, Report, reports, $rootScope, Search, user) {

    var self = this;

    self.permissions = {};

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

    self.download = function() {

      /**
       * In order to download all the results we need to make a second request
       * to the API.
       */
      var search_params = $location.search();

      Report.query({
        q: search_params.q,
        results_per_page: self.search.data.properties.num_results
      }).$promise.then(function(reportResponse) {
        Exporter.geojsonToCsv(reportResponse);
      });
    };

    //
    // This is the first page the authneticated user will see. We need to make
    // sure that their user information is ready to use. Make sure the
    // Account.userObject contains the appropriate information.
    //
    if (Account.userObject && user) {
      user.$promise.then(function(userResponse) {
        $rootScope.user = Account.userObject = userResponse;

        self.permissions = {
          isLoggedIn: Account.hasToken(),
          isAdmin: Account.hasRole('admin'),
          isProfile: false
        };
      });
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
        busy: false,
        page: 1,
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

        var service = this;

        if (service.busy) {
          return;
        }

        service.busy = true;
        service.page++;

        if (service.data && service.page >= service.data.properties.total_pages) {
          return;
        }

        //
        // Load our filters
        //
        this.filters(service.page, 25);

        service.resource.query($location.search()).$promise.then(function(successResponse) {
          service.busy = false;

          var reports = successResponse,
              existing = service.data.features;

          service.data.features = existing.concat(reports.features);
        });

       },
       hashtag: function(tag, field) {
          this.params[field] = tag;
          this.execute();
       },
       filters: function(_page, _results_per_page) {
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
           q: angular.toJson(q),
           page: _page ? _page : 1
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
        controllerAs: 'about',
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
 * @name wr.about.controller:AboutController
 * @description
 * # AboutController
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('AboutController', function (Account, $rootScope, user) {

    var self = this;

    /**
     * This is the first page the authneticated user will see. We need to make
     * sure that their user information is ready to use. Make sure the
     * Account.userObject contains the appropriate information.
     */
    if (Account.userObject && !Account.userObject.id) {
      if (user) {
        user.$promise.then(function(userResponse) {
          $rootScope.user = Account.userObject = userResponse;

          self.permissions = {
            isLoggedIn: Account.hasToken(),
            isAdmin: Account.hasRole('admin'),
            isProfile: false
          };
        });
      }
    }

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

(function() {

  'use strict';

  /**
   * @ngdoc function
   * @name
   * @description
   */
  angular.module('WaterReporter')
    .controller('ActivityController', function (Account, features, $location, leafletData, leafletEvents, Map, mapbox, mapboxGeometry, Report, reports, $rootScope, $scope, Search, user) {

      var self = this;

      /**
       * Setup our Features so that they appear on the home page in the
       * appropriate position
       */
      this.features = features;

      this.vignette = true;

      this.permissions = {};

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

      this.search.data = reports;

      //
      // This is the first page the authneticated user will see. We need to make
      // sure that their user information is ready to use. Make sure the
      // Account.userObject contains the appropriate information.
      //
      if (Account.userObject && user) {
        user.$promise.then(function(userResponse) {
          $rootScope.user = Account.userObject = userResponse;

          self.permissions = {
            isLoggedIn: Account.hasToken(),
            isAdmin: Account.hasRole('admin'),
            isProfile: false
          };

        });
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

          leafletData.getMap().then(function(map) {

            $scope.$on('leafletDirectiveMarker.click', function(event, args) {
              $location.path(self.map.markers[args.modelName].permalink);
            });

            $scope.$on('leafletDirectiveMap.focus', function() {
              self.map.toggleControls('show');
              self.vignette = false;

              var vignette = document.getElementById('map--vignette');
              vignette.className = 'map--vignette map--vignette--hidden';
            // });
            //
            // $scope.$on('leafletDirectiveMap.blur', function() {
            //   self.map.toggleControls('hide');
            //   self.vignette = true;
            //
            //   var vignette = document.getElementById('map--vignette');
            //   vignette.className = 'map--vignette map--vignette--hidden';
            });

          });

       });

      this.hideVignette = function() {

        self.vignette = false;

        var vignette = document.getElementById('map--vignette');
        vignette.className = 'map--vignette map--vignette--hidden';

        var feature = document.getElementById('map--featured');
        feature.className = 'map--featured map--feature--hidden';

        var map_ = document.getElementById('map--wrapper');
        map_.className = 'map--wrapper map--wrapper--expanded';

        self.map.toggleControls('show');

        leafletData.getMap().then(function(map) {
          map.invalidateSize();
        });
      };

      this.showVignette = function() {

        self.vignette = true;

        var vignette = document.getElementById('map--vignette');
        vignette.className = 'map--vignette';

        var feature__ = document.getElementById('map--featured');
        feature__.className = 'map--featured';

        var map_ = document.getElementById('map--wrapper');
        map_.className = 'map--wrapper';

        self.map.toggleControls('hide');

        leafletData.getMap().then(function(map) {
          map.invalidateSize();
        });
      };

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

        if (self.vignette === false) {
          self.showVignette();
        }
      };

      self.key = function($event) {

        if ($event.keyCode === 39) {
          if (self.features.visible < self.map.geojson.reports.data.features.length) {
            var index = self.features.visible+1;
            self.changeFeature(self.map.geojson.reports.data.features[index], index);
          }
        } else if ($event.keyCode === 37) {
          if (self.features.visible <= self.map.geojson.reports.data.features.length) {
            var index = self.features.visible-1;
            self.changeFeature(self.map.geojson.reports.data.features[index], index);
          }
        }
      };

    });

}());

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
  .controller('HomeController', function (Account, Report, $rootScope, Search, user) {

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
     * This is the first page the authneticated user will see. We need to make
     * sure that their user information is ready to use. Make sure the
     * Account.userObject contains the appropriate information.
     */
    if (Account.userObject && !Account.userObject.id) {
      if (user) {
        user.$promise.then(function(userResponse) {
          $rootScope.user = Account.userObject = userResponse;

          self.permissions = {
            isLoggedIn: Account.hasToken(),
            isAdmin: Account.hasRole('admin')
          };

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
      })
      .when('/profiles/:userId/edit', {
        templateUrl: '/modules/components/profile/profileEdit--view.html',
        controller: 'ProfileEditController',
        controllerAs: 'page',
        resolve: {
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
          },
          profile: function($route, User) {
            return User.get({
              id: $route.current.params.userId
            });
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

    this.permissions = {};

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
    if (Account.userObject && user) {
      user.$promise.then(function(userResponse) {
        $rootScope.user = Account.userObject = userResponse;

        self.permissions = {
          isLoggedIn: Account.hasToken(),
          isAdmin: Account.hasRole('admin')
        };

        self.permissions.isCurrentUser = ($rootScope.user.id === parseInt($route.current.params.userId)) ? true : false;

        if ($rootScope.user.id === parseInt($route.current.params.userId)) {
          self.permissions.isProfile = true;
        }

        self.visible.reports = (self.permissions.isCurrentUser) ? true : false;
        self.visible.submissions = (self.permissions.isCurrentUser) ? false : true;

        if (self.permissions.isAdmin) {
          self.loadDashboard();
        }
      });
    }

  });

'use strict';

/**
 * @ngdoc function
 * @name
 * @description
 */
angular.module('WaterReporter')
  .controller('ProfileEditController', function (Account, Image, profile, Report, $rootScope, $route, Search, $scope, user, User) {

    var self = this;

    self.image = null;

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
    // Load main Profile data
    //
    profile.$promise.then(function(profileResponse) {

      self.profile = profileResponse;

      if (self.profile.properties.telephone.length === 0) {
        self.profile.properties.telephone = [{}];
      }
      if (self.profile.properties.organization.length === 0) {
        self.profile.properties.organization = [{}];
      }
    });

    //
    // This is the first page the authneticated user will see. We need to make
    // sure that their user information is ready to use. Make sure the
    // Account.userObject contains the appropriate information.
    //
    if (Account.userObject && user) {
      user.$promise.then(function(userResponse) {
        $rootScope.user = Account.userObject = userResponse;

        self.permissions = {
          isLoggedIn: Account.hasToken(),
          isAdmin: Account.hasRole('admin'),
          isProfile: false,
          isCurrentUser: false
        };

      });
    }

    self.save = function() {

      var profile_ = new User({
        id: self.profile.id,
        first_name: self.profile.properties.first_name,
        last_name: self.profile.properties.last_name,
        email: self.profile.properties.email,
        description: self.profile.properties.description,
        title: self.profile.properties.title,
        organization_name: self.profile.properties.organization_name,
        telephone: [{
          number: self.profile.properties.telephone[0].properties.number
        }],
        images: self.profile.properties.images
      });

      if (!self.profile.properties.organization[0].properties.name) {
        profile_.organization = [];
      } else if (self.profile.properties.organization.length && self.profile.properties.organization[0].properties.id) {
        profile_.organization = [
          {
            id: self.profile.properties.organization[0].properties.id,
            name: self.profile.properties.organization[0].properties.name
          }
        ];
      } else if (self.profile.properties.organization.length && self.profile.properties.organization[0].properties.name) {
        profile_.organization = [
          {
            name: self.profile.properties.organization[0].properties.name
          }
        ];
      }

      if (self.image) {
         var fileData = new FormData();

         fileData.append('image', self.image);

         Image.upload({}, fileData).$promise.then(function(successResponse) {

           console.log('successResponse', successResponse);

           profile_.images = [
             {
               id: successResponse.id
             }
           ];

           profile_.picture = successResponse.thumbnail;

           profile_.$update(function() {
             $route.reload();
           });

         });
      } else {
         profile_.$update(function() {
           $route.reload();
         });
      }
   };

   self.removeImage = function(imageId) {
    self.profile.properties.images= [];
   };

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
  .controller('ReportController', function (Account, comments, Comment, Image, leafletData, Map, mapbox, mapboxGeometry, $location, $rootScope, report, Report, $route, Search, user) {

    var self = this;

    self.image = null;

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
     * Setup the User object so that we can determine the type of authentication,
     * user permissions, and if the current page is the profile page.
     *
     * @param (object) A User $promise
     */
    if (user) {
      user.$promise.then(function(userResponse) {
        $rootScope.user = Account.userObject = userResponse;

        self.permissions = {
          isLoggedIn: Account.hasToken(),
          isAdmin: Account.hasRole('admin'),
          isProfile: false
        };

      });
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

        if (self.image) {
          var fileData = new FormData();

          fileData.append('image', self.image);

          Image.upload({}, fileData).$promise.then(function(successResponse) {

            console.log('successResponse', successResponse);

            comment.images = [
              {
                id: successResponse.id
              }
            ];

            comment.$save(function() {
              $route.reload();
            });

          });
        } else {
          comment.$save(function() {
            $route.reload();
          });
        }
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
        controllerAs: 'page',
        resolve: {
          user: function(Account) {
            return (Account.userObject && !Account.userObject.id) ? Account.getUser() : Account.userObject;
          }
        }
      });

  });

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
    .controller('SubmitController', function (Account, Image, leafletData, $location, Map, Notifications, Report, $rootScope, $scope, user) {

      var self = this;

      $rootScope.page = {
        class: 'map--controls--visible'
      };

      self.image = null;

      //
      // Setup all of our basic date information so that we can use it
      // throughout the page
      //
      self.today = new Date();

      self.days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ];

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

      //
      // Define the generic map
      //
      self.map = Map;

      //
      // We mush reset the Markers and Center to ensure that they are not
      // being retain by the Map service from previous pages.
      //
      self.map.markers = {
        reportGeometry: {
          lng: -77.534,
          lat: 40.834,
          message: 'Drag me to your report location',
          focus: true,
          draggable: true
        }
      };

      self.map.center = {
        lng: -77.534,
        lat: 40.834,
        zoom: 7
      };

      self.report.geometry = {
        type: 'GeometryCollection',
        geometries: []
      };

      self.report.geometry.geometries.push({
        type: 'Point',
        coordinates: [
          self.map.markers.reportGeometry.lng,
          self.map.markers.reportGeometry.lat
        ]
      });


      //
      // We use this function for handle any type of geographic change, whether
      // through the map or through the fields
      //
      self.map.processPin = function(coordinates, zoom) {

        if (coordinates.lat === null || coordinates.lat === undefined || coordinates.lng === null || coordinates.lng === undefined) {
          console.log('Invalid coordinates, existing pin processing');
          return;
        }

        console.log('coordinates changed', coordinates)

        //
        // Move the map pin/marker and recenter the map on the new location
        //
        self.map.markers = {
          reportGeometry: {
            lng: coordinates.lng,
            lat: coordinates.lat,
            focus: false,
            draggable: true
          }
        };

        //
        // Update the coordinates for the Report
        //
        self.report.geometry = {
          type: 'GeometryCollection',
          geometries: []
        };

        self.report.geometry.geometries.push({
          type: 'Point',
          coordinates: [
            coordinates.lng,
            coordinates.lat
          ]
        });


        leafletData.getMap().then(function(map) {
          map.invalidateSize();

          zoom = (zoom) ? zoom : map._zoom;

          self.map.center = {
            lng: coordinates.lng,
            lat: coordinates.lat,
            zoom: zoom
          };
        });

      };

      /**
       * Take our three separate date fields (i.e., month, day, year) and on
       * field updates change the report.report_date scoped object so that it
       * builds a proper Date object for our Report $resource
       */
      self.date = {
        month: self.months[self.today.getMonth()],
        date: self.today.getDate(),
        day: self.days[self.today.getDay()],
        year: self.today.getFullYear()
      };

      $scope.$watch(angular.bind(this, function() {
        return this.date;
      }), function (response) {
        var _new = response.month + ' ' + response.date + ' ' + response.year,
            _date = new Date(_new);

        self.date.day = self.days[_date.getDay()];

        self.report.report_date = _date;
      }, true);

      self.status = {
        saving: {
          action: false,
          message: null
        }
      }


      //
      //
      //
      self.save = function() {

        self.status.saving.action = true;
        self.status.saving.message = 'Uploading your image...';


        self.report.state = 'open';
        self.report.is_public = true;

        if (self.image) {
          var fileData = new FormData();

          fileData.append('image', self.image);

          self.status.saving.message = 'Saving your image...';

          Image.upload({}, fileData).$promise.then(function(imageResponse) {

            self.status.saving.message = 'Saving your report...';

            self.report.images = [
              {
                id: imageResponse.id
              }
            ];

            self.report.$save(function(response) {
              $rootScope.notifications.success();
              $location.path('/reports/' + response.id);
            }, function() {
              $rootScope.notifications.error('', 'An error occurred and we couldn\'t save your report');
              self.status.saving.action = false;
              return;
            });
          }, function() {
            $rootScope.notifications.error('', 'An error occurred and we couldn\'t save your report');
            self.status.saving.action = false;
            return;
          });
        } else {
          self.report.$save(function(response) {
            $location.path('/reports/' + response.id);
          });
        }

      };


      //
      // Define our map interactions via the Angular Leaflet Directive
      //
      leafletData.getMap().then(function(map) {

        //
        // Update the pin and segment information when the user clicks on the map
        // or drags the pin to a new location
        //
        $scope.$on('leafletDirectiveMap.click', function(event, args) {
          self.map.processPin(args.leafletEvent.latlng, map._zoom);
        });

        $scope.$on('leafletDirectiveMap.dblclick', function(event, args) {
          self.map.processPin(args.leafletEvent.latlng, map._zoom+1);
        });

        $scope.$on('leafletDirectiveMarker.dragend', function(event, args) {
          self.map.processPin(args.leafletEvent.target._latlng, map._zoom);
        });

        $scope.$on('leafletDirectiveMarker.dblclick', function(event, args) {
          var zoom = map._zoom+1;
          map.setZoom(zoom);
        });

      });

      /**
       * This is the first page the authneticated user will see. We need to make
       * sure that their user information is ready to use. Make sure the
       * Account.userObject contains the appropriate information.
       */
      if (Account.userObject && !Account.userObject.id) {
        if (user) {
          user.$promise.then(function(userResponse) {
            $rootScope.user = Account.userObject = userResponse;

            self.permissions = {
              isLoggedIn: Account.hasToken(),
              isAdmin: Account.hasRole('admin'),
              isProfile: false
            };
          });
        }
      }


    });

}());
