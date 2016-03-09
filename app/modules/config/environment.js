(function() {

  "use strict";

   angular.module('config', [])
    .constant('environment', {
      name: 'production',
      apiUrl: 'https://api.waterreporter.org/v2',
      siteUrl: 'https://www.waterreporter.org',
      clientId: 'Ru8hamw7ixuCtsHs23Twf4UB12fyIijdQcLssqpd'
    });

}());
