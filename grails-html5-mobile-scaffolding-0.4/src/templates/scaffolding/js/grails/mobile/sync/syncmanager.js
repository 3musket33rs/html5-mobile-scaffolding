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
grails.mobile.sync = grails.mobile.sync || {};

grails.mobile.sync.syncmanager = function (url, domainName, controller, store, model) {
    var that = {};
    var store = store;
    var domainName = domainName;
    var model = model;

    controller.onlineEvent.attach(function (item) {
        synchronization();
    });

    var synchronization = function () {
        var elementsToSync = store.dirty();
        $.each(elementsToSync, function (key, value) {
            var action = value.offlineAction;
            sync[action](value);
        });
    };

    var sync = {
        DELETED: function (value) {
            var wrappedValue = {};
            wrappedValue = {id: value.id};
            send(wrappedValue, "delete", "POST", syncDeleted);
        },
        CREATED: function (value) {
            var wrappedValue = {};
            wrappedValue[domainName] = JSON.stringify(value);
            send(wrappedValue, "save", "POST", syncCreated);
        },
        UPDATED: function (value) {
            var wrappedValue = {};
            wrappedValue[domainName] = JSON.stringify(value);
            send(wrappedValue, "update", "POST", syncUpdated);
        }
    };

    var syncCreated = function (data, action, dataSent) {
        if (data.message) {
            alert(data.message);
            return;
        }
        if (data.errors) {
            // Here I need to add to field mapping for errors
            alert("validation issue" + data.errors);
            return;
        }
        var usefulString = dataSent[domainName];
        var oldObj = JSON.parse(usefulString);

        store.remove(oldObj);
        model.deleteItem(oldObj);
        store.store(data);
        model.createItem(data);
    };

    var syncUpdated = function (data, action) {
        if (data.message) {
            alert(data.message);
            return;
        }
        if (data.errors) {
            // Here I need to add to field mapping for errors
            alert("validation issue" + data.errors);
            return;
        }
        store.store(data);
        model.updateItem(data);
    };

    var syncDeleted = function (data, action) {
        if (data.message) {
            alert(data.message);
            return;
        }
        if (data.errors) {
            // Here I need to add to field mapping for errors
            alert("validation issue" + data.errors);
            return;
        }
        store.remove(data);
    };

    // Asynchronous Ajax call to server
    var send = function (item, action, type, callback) {
        $.ajax(cfg(url, type, action, item, callback));
    };


    var cfg = function (url, type, action, dataToSend, successCallback) {
        return {
            cache: false,
            type: type,
            async: false,
            data: dataToSend,
            dataType: "jsonp",
            url: url + action,
            success: function (data) {
                successCallback(data, action, dataToSend);
            },
            error: function (xhr) {
                alert(xhr.responseText);
            }
        };
    };

    return that;
};
