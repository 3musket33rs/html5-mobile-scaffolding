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

var grails = grails || {};
grails.mobile = grails.mobile || {};
grails.mobile.map = grails.mobile.map || {};
grails.mobile.map.googleMapService = function () {

    var that = {};
    var map;
    var markers = {};

    that.emptyMap = function (canvasId) {
        that.showMap(canvasId, 0, 0, false);
    };

    that.showMap = function (canvasId, lat, lng, addMarker) {
        if (map) {
            clearMap();
        }
        var latlng = new google.maps.LatLng(lat, lng);

        var myOptions = {
            zoom: 18,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById(canvasId), myOptions);
        if (addMarker) {
            var marker = new google.maps.Marker({
                position: latlng,
                map: map
            });
            markers["grails.mobile.centerMarker"] = marker;
        }
    };

    that.refreshCenterZoomMap = function () {
        var bounds = new google.maps.LatLngBounds();
        var previousZoom = map.getZoom();

        $.each(markers, function (name, value) {
            bounds.extend(value.getPosition());
        });
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);

        zoomChangeBoundsListener =
            google.maps.event.addListenerOnce(map, 'bounds_changed', function (event) {
                if (!this.getZoom()) {
                    this.setZoom(previousZoom);
                }
            });
        setTimeout(function () {
            google.maps.event.removeListener(zoomChangeBoundsListener);
        }, 2000);
    };

    that.addMarkers = function(geolocatedObject) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(geolocatedObject.latitude, geolocatedObject.longitude),
            map: map
        });
        markers[geolocatedObject.class + geolocatedObject.id + "_marker"] = marker;
    };

    var clearMap = function () {
        $.each(markers, function (key, value) {
            if (value) {
                value.setMap(null);
            }
        });
        $.each(map.controls, function (key, value) {
            if (value) {
                value.clear();
            }
        });
        google.maps.event.clearInstanceListeners(map);
        map = null;
    };

    return that;
};

