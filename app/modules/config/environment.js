(function() {

  "use strict";

   angular.module('config', [])
    .constant('environment', {
      name: 'production',
      apiUrl: 'https://api.waterreporter.org/v2',
      siteUrl: 'https://www.waterreporter.org',
      clientId: 'SG92Aa2ejWqiYW4kI08r6lhSyKwnK1gDN2xrryku'
    });

}());
