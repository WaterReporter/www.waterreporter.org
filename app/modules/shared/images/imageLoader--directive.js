'use strict';

/**
 * @ngdoc overview
 * @name
 * @description
 */
angular.module('WaterReporter')
    .directive('imageLoader',
        function (EXIF) {

            //console.log(orientImage);

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
                          console.log('e', e);
                            if (this.status === 200) {
                                image.src = URL.createObjectURL(http.response);

                                image.onload = function () {
                                    EXIF.getData(image, function () {
                                        console.log(EXIF.pretty(this));
                                        console.log(EXIF.getTag(this, 'Orientation'));
f
                                        var o = EXIF.getTag(this, 'Orientation');

                                        switch (o) {

                                        case 3:

                                            element.addClass('flip-vertical');

                                            element.attr('width', 540);

                                            break;

                                        case 6:

                                            //image.width = 400;

                                            element.addClass('rotate-right');

                                            element.attr('width', 720);

                                            break;

                                        default:

                                            element.attr('width', 540);

                                            //image.width = 400;

                                            //

                                            break;

                                        }

                                    });
                                };
                                //image.src = URL.createObjectURL(http.response);
                                element.attr('src', image.src);

                            }
                        };

                        http.onprogress = function (e) {
                            console.log(e);
                            if (e.lengthComputable) {
                                image.completedPercentage = parseInt((e.loaded / e.total) * 100);
                                console.log(image.completedPercentage);
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
