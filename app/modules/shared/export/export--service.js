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
        },
        /**
         * Create a CSV file structure from a GeoJSON Blob
         *
         * @param (object) geoJsonObject
         *
         * @return (object) csvFile
         */
        geojson: function (geoJsonObject) {

          var date = new Date().toISOString(),
              filename = 'WaterReporter--ReportsSearch' + date + '.geojson';

          var a         = document.createElement('a');
          a.href        = 'data:attachment/json,' + JSON.stringify(geoJsonObject);
          a.target      = '_blank';
          a.download    = filename;

          document.body.appendChild(a);
          a.click();
        }
      };

      return _public;
    });


} ());
