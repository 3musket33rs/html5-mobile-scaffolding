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

grails.mobile.mvc.manager = function (configuration) {
    var that = {};

    var baseURL = configuration.baseURL;
    var namespace = configuration.namespace;
    var controllers = {};
    var resolveNamespace = function (functionName) {
        var that = {};
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        var ns = namespaces.join('.');
        if (ns === '') {
            ns = 'window';
        }
        that.namespace = eval(ns);
        that.function = func;
        return that;
    };

    controllers = $.each(configuration.domain, function () {
        var domainName = this.name;

        // create model for domain object
        var model = grails.mobile.mvc.model();

        // create local storage for domain object
        var store = grails.mobile.storage.store(model, domainName);

        // create view for domain object
        var viewName = namespace + '.view.' + this.name + 'view';
        var funcToApply = resolveNamespace(viewName);
        var view = funcToApply.namespace[funcToApply.function].call(funcToApply.namespace, model, this.view);

        // Create Feed
        var feed = grails.mobile.feed.feed(baseURL + this.name + '/', store);

        // create controller for domain object
        var controller = grails.mobile.mvc.controller(feed, model, view);

        grails.mobile.sync.syncmanager(baseURL + this.name + '/', domainName, controller, store, model);

    });

    return that;
};