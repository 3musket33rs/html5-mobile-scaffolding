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
 * Event class used by MVC to communicate from view to controller or from Model to view.
 * Controller has direct access to views and model.
 */
var grails = grails || {};
grails.mobile = grails.mobile || {};

grails.mobile.event = function () {
    var that = {};
    that.listeners = [];

    that.attach = function (listener) {
        that.listeners.push(listener);
    };

    that.notify = function (data, event) {
        var index;

        for (index = 0; index < that.listeners.length; index += 1) {
            that.listeners[index](data, event);
        }
    };
    return that;
};