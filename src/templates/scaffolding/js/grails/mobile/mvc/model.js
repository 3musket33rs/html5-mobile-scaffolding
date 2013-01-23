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
 * Model represents list of data used for CRUD.
 */
var grails = grails || {};
grails.mobile = grails.mobile || {};
grails.mobile.mvc = grails.mobile.mvc || {};

grails.mobile.mvc.model = function (items) {
    var that = {};
    that.items = {};
    that.dependentItems = {};

    // register events
    that.listedItems = grails.mobile.event(that);
    that.listedDependentItems = grails.mobile.event(that);
    that.createdItem = grails.mobile.event(that);
    that.updatedItem = grails.mobile.event(that);
    that.deletedItem = grails.mobile.event(that);

    that.getItems = function () {
        return that.items;
    };

    that.listDependent = function (dependent, dependentName, relationType, items) {
        var keyItem;
        var list = {}
        for (keyItem in items) {
            list[items[keyItem].id] = items[keyItem];
        }
        that.dependentItems[dependent] = list;
        that.listedDependentItems.notify({'items': that.dependentItems[dependent], relationType: relationType, dependentName: dependentName});
    };

    that.listItems = function (items, notifyView) {
        var keyItem;
        for (keyItem in items) {
            that.items[items[keyItem].id] = items[keyItem];
        }
        if (notifyView) {
            that.listedItems.notify({'items': that.items});
        }
    };

    that.createItem = function (item, context) {
        that.createdItem.notify({item: item}, context);
        if (item.errors || item.message) {
            return false;
        }
        that.items[item.id] = item;
        return true;
    };

    that.updateItem = function (item, context) {
        that.updatedItem.notify({item: item}, context);
        if (item.errors || item.message) {
            return false;
        }
        that.items[item.id] = item;
        return true;
    };

    that.deleteItem = function (item, context) {
        that.deletedItem.notify({item:item}, context);
        if (item.errors || item.message) {
            return false;
        }
        if (item.offlineStatus != 'NOT-SYNC') {
            delete that.items[item.id];
        }
        return true;
    };

    return that;
};

