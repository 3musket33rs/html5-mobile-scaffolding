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
    var key = "grails.mobile." + that.domainName;

    that.store = function (object) {
        var oldValue = localStorage.getItem(key);
        var listDomainObject = grails.mobile.helper.toDomainObject(oldValue);

        listDomainObject[object.id] = object;
        localStorage.setItem(key, JSON.stringify(listDomainObject));
        return object;
    };

    that.storeList = function (object) {
        var oldValue = localStorage.getItem(key);
        var listDomainObject = grails.mobile.helper.toDomainObject(oldValue);
        var itemKey;

        for (itemKey in object) {
            listDomainObject[object[itemKey].id] = object[itemKey];
        }
        localStorage.setItem(key, JSON.stringify(listDomainObject));
    };

    that.remove = function (object) {
        if (object) {
            var oldValue = localStorage.getItem(key);
            localStorage.removeItem(key);

            var listDomainObject = grails.mobile.helper.toDomainObject(oldValue);
            var domainKey;
            for (domainKey in listDomainObject) {
                if (domainKey == object.id) {
                    delete listDomainObject[domainKey];
                }
            }
            localStorage.setItem(key, JSON.stringify(listDomainObject));
        }
    };

    // When offline, get list from local storage
    that.read = function (id) {
        var stringValue = localStorage.getItem(key);
        var list = grails.mobile.helper.toDomainObject(stringValue);
        if (id) {
            for (var k in list) {
                if(list[k].id == id) {
                    return list[k];
                }
            }
            return null;
        }
        return list;
    };

    that.dirty = function () {
        var stringValue = localStorage.getItem(key);
        var list = grails.mobile.helper.toDomainObject(stringValue);
        var filteredList = {};
        for (var k in list) {
            if(list[k].offlineStatus === 'NOT-SYNC') {
                filteredList[k] = list[k];
            }
        }
        return filteredList;
    };

    return that;
};


