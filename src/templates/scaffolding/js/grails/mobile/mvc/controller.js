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
 * The Controller. Controller is notified by view of user actions.
 * Controller sends asynchronous call to server if needed and changes
 * the model.
 */
var grails = grails || {};
grails.mobile = grails.mobile || {};
grails.mobile.mvc = grails.mobile.mvc || {};

grails.mobile.mvc.controller = function (feed, model, view) {
    var that = {};
    that.model = model;
    var feed = feed;

    that.onlineEvent = grails.mobile.event();

    // Register events
    view.offlineEvent.attach(function (item) {
        feed.setOffline();
    });

    view.onlineEvent.attach(function (item) {
        feed.setOnline();
        that.onlineEvent.notify();
    });

    view.listButtonClicked.attach(function (item) {
        listItem();
    });

    view.createButtonClicked.attach(function (item) {
        createItem(item);
    });

    view.updateButtonClicked.attach(function (item) {
        updateItem(item);
    });

    view.deleteButtonClicked.attach(function (itemId) {
        deleteItem(itemId);
    });

    var listItem = function () {
        var list = feed.listItems(listed);
    };

    var listed = function (data) {
        that.model.listItems(data);
    };

    var createItem = function (data) {
        feed.createItem(data, created);
    };

    var created = function (data) {
        if (data.message) {
            alert(data.message);
            return;
        }
        if (data.errors) {
            // Here I need to add to field mapping for errors
            alert("validation issue" + data.errors);
            return;
        }
        that.model.createItem(data);
    };

    var updateItem = function (data) {
        feed.updateItem(data, updated);
    };

    var updated = function (data, action) {
        if (data.message) {
            alert(data.message);
            return;
        }
        if (data.errors) {
            // Here I need to add to field mapping for errors
            alert("validation issue" + data.errors);
            return;
        }
        that.model.updateItem(data);
    };

    var deleteItem = function (data) {
        feed.deleteItem(data, deleted);
    };

    var deleted = function (data, action) {
        if (data.message) {
            alert(data.message);
            return;
        }
        if (data.errors) {
            // Here I need to add to field mapping for errors
            alert("validation issue" + data.errors);
            return;
        }
        that.model.deleteItem(data);
    };

    return that;
};

