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
    var grailsEvents = new grails.Events(configuration.baseURL, {transport: 'sse'});

    var controllers = {};

    var resolveNamespace = function (functionPath) {
        var namespaces = functionPath.split(".");
        var funcName = namespaces.pop();
        var parent = window;
        namespaces.forEach(function (name) {
            if (typeof parent != 'undefined') {
                parent = parent[name];
            }
        });
        if (typeof parent === 'undefined') {
            throw new TypeError("'" + functionPath + "' does not exist");
        }
        var func = parent[funcName];
        if (typeof func !== 'function') {
            throw new TypeError("'" + functionPath + "' is not a function");
        }
        return func;
    };

    that.domainsObjects = {};
    $.each(configuration.domain, function () {

        if (this.options === undefined) {
            this.options = {
                offline: true,
                eventPush: true
            }
        }

        var domainName = this.name;

        // create model for domain object
        var model = grails.mobile.mvc.model();

        // create local storage for domain object
        if (this.options.offline) {
            var store = grails.mobile.storage.store(model, domainName);
        }

        // create view for domain object
        var viewName = namespace + '.view.' + this.name + 'view';
        var funcToApply = resolveNamespace(viewName);
        var view = funcToApply.call(this, model, this.view);

        // Create Feed
        var feed = grails.mobile.feed.feed(baseURL + this.name + '/', store);

        // create controller for domain object
        var controller = grails.mobile.mvc.controller(feed, model, view);

        var sync = grails.mobile.sync.syncmanager(baseURL + this.name + '/', domainName, controller, store, model, this.options);

        var push = grails.mobile.push.pushmanager(grailsEvents, domainName, store, model, this.options);

        that.domainsObjects[domainName] = {
            model:model,
            view:view,
            controller:controller,
            sync:sync,
            push: push
        };
    });

    $.each(configuration.domain, function () {
        if (this.hasOneRelations) {
            that.domainsObjects[this.name].controller.hasOneRelations = {};
            for (var i = 0; i < this.hasOneRelations.length; i++) {
                var relationName = this.hasOneRelations[i].type + '_' + this.hasOneRelations[i].name;
                that.domainsObjects[this.name].controller.hasOneRelations[relationName] = that.domainsObjects[this.hasOneRelations[i].type].controller;
            }
        }
        if (this.oneToManyRelations) {
            that.domainsObjects[this.name].controller.oneToManyRelations = {};
            for (var i = 0; i < this.oneToManyRelations.length; i++) {
                var relationName = this.oneToManyRelations[i].type + '_' + this.oneToManyRelations[i].name;
                that.domainsObjects[this.name].controller.oneToManyRelations[relationName] = that.domainsObjects[this.oneToManyRelations[i].type].controller;
            }
        }
    });


    return that;
};