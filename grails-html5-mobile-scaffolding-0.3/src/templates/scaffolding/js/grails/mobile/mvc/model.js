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

    // register events
    that.listedItems = grails.mobile.event(that);
    that.createdItem = grails.mobile.event(that);
    that.updatedItem = grails.mobile.event(that);
    that.deletedItem = grails.mobile.event(that);

    that.getItems = function () {
        return that.items;
    };

    that.listItems = function (json) {
        var keyItem;
        for (keyItem in json) {
            that.items[json[keyItem].id] = json[keyItem];
        }
        that.listedItems.notify({'items': that.items});
    };

    that.createItem = function (item) {
        that.items[item.id] = item;
        that.createdItem.notify({item: item});
    };

    that.updateItem = function (item) {
        that.items[item.id] = item;
        that.updatedItem.notify({item: item});
    };

    that.deleteItem = function (item) {
        delete that.items[item.id];
        that.deletedItem.notify({item:item});
    };



    return that;
};

