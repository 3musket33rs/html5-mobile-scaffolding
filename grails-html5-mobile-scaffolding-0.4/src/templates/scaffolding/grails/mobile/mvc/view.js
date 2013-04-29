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
grails.mobile.mvc = grails.mobile.mvc || {};

grails.mobile.mvc.view = function (model, elements) {
    var that = {};
    that.model = model;
    that.elements = elements;

    // List of events for the view
    that.createButtonClicked = grails.mobile.event();
    that.updateButtonClicked = grails.mobile.event();
    that.addButtonClicked = grails.mobile.event();
    that.deleteButtonClicked = grails.mobile.event();
    that.listButtonClicked = grails.mobile.event();
    that.editButtonClicked = grails.mobile.event();

    that.onlineEvent = grails.mobile.event();
    that.offlineEvent = grails.mobile.event();

    return that;
};


