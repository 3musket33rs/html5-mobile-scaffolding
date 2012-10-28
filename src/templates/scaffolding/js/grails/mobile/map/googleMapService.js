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
    var canvasId;

    that.emptyMap = function (canvasId) {
        that.showMap(canvasId, 0, 0, null);
    };

    that.showMap = function (canvasId, lat, lng, coord) {
        that.canvasId = canvasId;
        var latlng = new google.maps.LatLng(lat, lng);
        if (!map) {
            createMap(canvasId, latlng);
        } else {
            removeMarkers();
        }
        if (coord) {
            var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                draggable: true
            });
            markers["grails.mobile.centerMarker"] = marker;
            coord.latitude.val(lat);
            coord.longitude.val(lng);
            google.maps.event.addListener(marker, 'dragend', function(event) {
                coord.latitude.val(event.latLng.lat());
                coord.longitude.val(event.latLng.lng());
            });
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
    };

    that.addMarker = function( geolocatedObject, text, callback) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(geolocatedObject.latitude, geolocatedObject.longitude),
            map: map,
            title: text
        });
        markers[geolocatedObject.id] = marker;
        google.maps.event.addListener(marker, 'click', function() {
            callback();
        });

    };

    that.refreshMarker = function (geolocatedObject) {
        var marker = markers[geolocatedObject.id];
        marker.setPosition(new google.maps.LatLng(geolocatedObject.latitude, geolocatedObject.longitude));
    };

    that.removeMarker = function (id) {
        var marker = markers[id];
        marker.setMap(null);
        delete markers[id];
    };

    var removeMarkers = function () {
        $.each(markers, function (key, marker) {
            marker.setMap(null);
            delete markers[key];
        });
    };

    var createMap = function (canvasId, latlng) {
        var myOptions = {
            zoom: 18,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById(canvasId), myOptions);
    };

    return that;
};

