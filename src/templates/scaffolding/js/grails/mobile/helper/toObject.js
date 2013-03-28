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
 * View are directly linked to the display of data. It uses jQuery
 * for its rendering.
 */
var grails = grails || {};
grails.mobile = grails.mobile || {};
grails.mobile.helper = grails.mobile.helper || {};


$(document).on( "mobileinit", function() {
    $.mobile.allowCrossDomainPages = true;
    $.mobile.phonegapNavigationEnabled = true;
    $.mobile.buttonMarkup.hoverDelay = 50;
});

grails.mobile.helper.isString = function isString(o) {
    return typeof o === "string" || (typeof o === "object" && o.constructor === String);
};

grails.mobile.helper.toDomainObject = function (objectString) {
    var listDomainObject;
    if (objectString) {
        listDomainObject = JSON.parse(objectString);
    } else {
        listDomainObject = {};
    }
    return listDomainObject;
};

grails.mobile.helper.getCookie = function(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }
    return unescape(dc.substring(begin + prefix.length, end));
};

grails.mobile.helper.toObject = function (inputs) {
    var objectData;
    objectData = {};

    $.each(inputs, function () {
        var value;
        var add = true;
        if (this.type === 'select-one') {
            value = $(this).val();
        } else if (this.type === 'text' && $(this).attr('data-type') === 'date') {
            value = $(this).scroller('getDate', true);
        } else if (this.type === 'radio') {
            if ($(this).is(':checked')) {
                value = this.value;
            } else {
                add = false;
            }
        } else if($(this).attr("data-gorm-relation") === "one-to-many") {
            if (!objectData[this.name]) {
                objectData[this.name] = [];
            }
            if (this.checked) {
                value = $(this).attr('id');
                var values = value.split('-');
                value = values[2];
            } else {
                add = false;
            }
        } else if (this.type === 'checkbox') {
            value = this.checked;
        } else {
            if ($(this).data('data-role') === 'calbox') {
                value = $(this).data('calbox').theDate;
            } else if (this.value !== null) {
                if ($(this).attr('data-value')) {
                    value = $(this).attr('data-value');
                } else {
                    value = this.value;
                }
            } else {
                value = '';
            }
        }
        if (add) {
            if ($(this).attr('data-gorm-relation') === "many-to-one") {
                objectData[this.name + '.id'] = value;
            } else if ($(this).attr('data-gorm-relation') === "one-to-many") {
                if (!objectData[this.name]) {
                    objectData[this.name] = [];
                }
                objectData[this.name].push({id:value});
            } else {
                objectData[this.name] = value;
            }
        }
    });

    return objectData;
};
