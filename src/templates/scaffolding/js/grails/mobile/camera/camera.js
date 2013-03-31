/*
 * Copyright 2012 3musket33rs
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 */
var grails = grails || {};
grails.mobile = grails.mobile || {};
grails.mobile.camera = grails.mobile.camera || {};

grails.mobile.camera.getPicture = function(input) {
    if (!window.cordova) {
        input.on('change', function() {
            if (input[0] && input[0].files && input[0].files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $(input).parent().css('background-image', "url(" + e.target.result +")");
                    $(input).attr('data-value', e.target.result);
                };
                reader.readAsDataURL(input[0].files[0]);

            }
        });
    } else {
        input.on('click', function() {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 70,
                targetWidth: 150,
                targetHeight: 250,
                correctOrientation: true,
                destinationType: Camera.DestinationType.DATA_URL
            });
        });
    }

    function onSuccess(imageData) {
        input.parent().css('background-image', "url(data:image/jpeg;base64," + imageData +")");
        input.attr('data-value', "data:image/jpeg;base64," + imageData);
    }

    function onFail(message) {
        console.log(message);
    }
};

grails.mobile.camera.encode = function (data) {
    var str = "";
    for (var i = 0; i < data.length; i++)
        str += String.fromCharCode(data[i]);
    return str;
};

