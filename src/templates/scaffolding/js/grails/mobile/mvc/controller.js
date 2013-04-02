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

grails.mobile.mvc.controller = function (feed, model, view, cfg) {
    var that = {};
    that.cfg = cfg;
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
        that.listItem(true);
    });

    view.editButtonClicked.attach(function () {
        listDependent();
    });

    view.createButtonClicked.attach(function (item, context) {
        createItem(item, context);
    });

    view.updateButtonClicked.attach(function (item, context) {
        updateItem(item, context);
    });

    view.deleteButtonClicked.attach(function (itemId, context) {
        deleteItem(itemId, context);
    });

    var listDependent = function () {
        if (that.hasOneRelations) {
            $.each(that.hasOneRelations, function(key, controller) {
                controller.listItem(false);
                var qualifyAttributes = key.split('_');
                var dependent = qualifyAttributes[0];
                var dependentName = qualifyAttributes[1];
                listedDependent(dependent, dependentName, "many-to-one", controller.model.getItems());
            });
        }
        if (that.oneToManyRelations) {
            $.each(that.oneToManyRelations, function(key, controller) {
                controller.listItem(false);
                var qualifyAttributes = key.split('_');
                var dependent = qualifyAttributes[0];
                var dependentName = qualifyAttributes[1];
                listedDependent(dependent, dependentName, "one-to-many",controller.model.getItems());
            });
        }
    };

    var listedDependent = function (dependent, dependentName, relationType, data) {
        that.model.listDependent(dependent, dependentName, relationType, data);
    };

    that.listItem = function (notifyView) {
        var listed = function (data) {
            that.model.listItems(data, notifyView);
        };
        if ($.isEmptyObject(that.model.getItems())) {
            var list = feed.listItems(listed);
        }
    };

    var createItem = function (data, context) {
        var created = function (data) {
            return that.model.createItem(data, context);
        };
        feed.createItem(data, created);
    };

    var updateItem = function (data, context) {
        var updated = function (data) {
            return that.model.updateItem(data, context);
        };

        feed.updateItem(data, updated);
    };

    var deleteItem = function (data, context) {
        var deleted = function (data) {
            that.model.deleteItem(data, context);
        };
        feed.deleteItem(data, deleted);
    };

    return that;
};

