'use strict';

/**
 * @ngdoc function
 * @name WaterReporter.home.controller:HomeController
 * @description
 * # HomeController
 * Controller of the waterReporterApp
 */
angular.module('WaterReporter')
  .controller('PageController', function (Account, $location, Notifications, $rootScope, $interval, user, $window) {

    var self = this;

    self.slides = {
      data: [
        {
          url: '/images/slide_1.jpg',
          title: 'Use the satellite or trails map to explore other peoples reports'
        },
        {
          url: '/images/slide_2.jpg'
        },
        // {
        //   url: '/images/slide_3.jpg'
        // },
        {
          url: '/images/slide_4.jpg'
        },
        {
          url: '/images/slide_5.jpg'
        },
        {
          url: '/images/slide_6.jpg'
        },
        {
          url: '/images/slide_7.jpg'
        },
        {
          url: '/images/slide_8.jpg'
        },
        {
          url: '/images/slide_9.jpg'
        },
        {
          url: '/images/slide_10.jpg'
        }
      ],
      visible: 0
    };

    $interval(function() {
      if ((self.slides.data.length - 1) > self.slides.visible) {
        self.slides.visible = self.slides.visible + 1;
      }
      else if ((self.slides.data.length - 1) <= self.slides.visible) {
        self.slides.visible = 0;
      }
    }, 3500);

    //
    // This is the first page the authneticated user will see. We need to make
    // sure that their user information is ready to use. Make sure the
    // Account.userObject contains the appropriate information.
    //
    if (Account.userObject && user) {
      user.$promise.then(function(userResponse) {
        $rootScope.user = Account.userObject = userResponse;

        if (!$rootScope.user.properties.first_name || !$rootScope.user.properties.last_name) {
          $rootScope.notifications.warning('Hey!', 'Please <a href="/profiles/' + $rootScope.user.id + '/edit">complete your profile</a> by sharing your name and a photo');
        }
      });
    }


    // ONLY RENDER VIDEO ON SCREENS LARGER THAN 640
    if($window.outerWidth > 640){

    // CREATE VIDEO TAG
    var video = document.createElement("video");
    video.setAttribute("class","site--background");
    video.setAttribute("autoplay","");
    video.setAttribute("loop","");
    video.setAttribute("poster","/images/WR_Shot1.mp4");

    // CREATE SOURCE TAG
    var sourceMP4 = document.createElement("source");
    sourceMP4.setAttribute("src","/images/WR_Shot1.mp4");
    sourceMP4.setAttribute("type","video/mp4");

    // CREATE SOURCE TAG
    var sourceWebM = document.createElement("source");
    sourceWebM.setAttribute("src","/images/WR_Shot1.webm");
    sourceWebM.setAttribute("type","video/mp4");

    // ADD TO VIDEO TAG
    video.appendChild(sourceMP4);
    video.appendChild(sourceWebM);

    var siteWrapper = document.getElementsByClassName("site--wrapper")[0];
    var siteContent = document.getElementsByClassName("site--content")[0];

    siteWrapper.insertBefore(video,siteContent);
    }

  });
