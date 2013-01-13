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
grails.mobile.feed = grails.mobile.feed || {};

grails.mobile.feed.feed = function (baseUrl, store) {
    var that = {};
    var onlineFeed = grails.mobile.feed.online(baseUrl, store);
    if (store) {
        var offlineFeed = grails.mobile.feed.offline(store);
        var currentFeed = navigator.onLine ? onlineFeed : offlineFeed;

        that.setOffline = function () {
            currentFeed = offlineFeed;
        };

        that.setOnline = function () {
            currentFeed = onlineFeed;
        };
    } else {
        var currentFeed = onlineFeed;

        that.setOffline = function () {
        };

        that.setOnline = function () {
        };
    }

    that.listItems = function (listed) {
        currentFeed.listItems(listed);
    };

    that.createItem = function (data, created) {
        currentFeed.createItem(data, created);
    };

    that.updateItem = function (data, updated) {
        currentFeed.updateItem(data, updated);
    };

    that.deleteItem = function (data, deleted) {
        currentFeed.deleteItem(data, deleted);
    };

    return that;
};
