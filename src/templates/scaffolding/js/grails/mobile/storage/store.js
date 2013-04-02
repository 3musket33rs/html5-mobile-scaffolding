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
grails.mobile.storage = grails.mobile.storage || {};

grails.mobile.storage.store = function (model, domainName) {
    var that = {};
    that.domainName = domainName;
    that.model = model;
    var localStorageKey = "grails.mobile." + that.domainName;

    that.store = function (object) {
        var oldValue = localStorage.getItem(localStorageKey);
        var listDomainObject = grails.mobile.helper.toDomainObject(oldValue);
        var newObject = {};
        $.each(object, function(prop) {
            if (!$.isArray(object[prop]) || object[prop].length < 50) {
                newObject[prop] = object[prop];
            }
        });
        listDomainObject[object.id] = newObject;
        localStorage.setItem(localStorageKey, JSON.stringify(listDomainObject));
        return object;
    };

    that.storeList = function (object) {
        var oldValue = localStorage.getItem(localStorageKey);
        var listDomainObject = grails.mobile.helper.toDomainObject(oldValue);
        $.each(object, function(key, value) {
            var newObject = {};
            $.each(value, function(prop) {
                if (!$.isArray(value[prop]) || value[prop].length < 50) {
                    newObject[prop] = value[prop];
                }
            });
            listDomainObject[value.id] = newObject;
        });
        localStorage.setItem(localStorageKey, JSON.stringify(listDomainObject));
    };

    that.remove = function (object) {
        if (object) {
            var oldValue = localStorage.getItem(localStorageKey);
            localStorage.removeItem(localStorageKey);

            var listDomainObject = grails.mobile.helper.toDomainObject(oldValue);
            var domainKey;
            $.each(listDomainObject, function(key, value) {
                if (key == object.id) {
                    delete listDomainObject[key];
                }
            });
            localStorage.setItem(localStorageKey, JSON.stringify(listDomainObject));
        }
    };

    // When offline, get list from local storage
    that.read = function (id) {
        var stringValue = localStorage.getItem(localStorageKey);
        var list = grails.mobile.helper.toDomainObject(stringValue);
        if (id) {
            var found = null;
            $.each(list, function(key, value) {
                if(value.id == id) {
                    found = value;
                }
            });
            return found;
        }
        return list;
    };

    that.dirty = function () {
        var stringValue = localStorage.getItem(localStorageKey);
        var list = grails.mobile.helper.toDomainObject(stringValue);
        var filteredList = {};
        $.each(list, function(key, value) {
            if(value.offlineStatus === 'NOT-SYNC') {
                filteredList[key] = value;
            }
        });
        return filteredList;
    };

    return that;
};


