<% import org.codehaus.groovy.grails.commons.GrailsDomainClass %>
<% classNameLowerCase = className.toLowerCase() %>

var ${packageName} = ${packageName} || {};
${packageName}.view = ${packageName}.view || {};

${packageName}.view.${classNameLowerCase}view = function (model, elements) {

    var that = grails.mobile.mvc.view(model, elements);
    <% if (geolocated) { %>
    var mapServiceList = grails.mobile.map.googleMapService();
    var mapServiceForm = grails.mobile.map.googleMapService();
    <% } %>
    // Register events
    that.model.listedItems.attach(function (data) {
        renderList();
    });

    that.model.createdItem.attach(function (data) {
        renderElement(data.item);
        \$('#list-${classNameLowerCase}s').listview('refresh');
    });

    that.model.updatedItem.attach(function (data) {
        var textDisplay = getText(data.item);
        \$('#${classNameLowerCase}' + data.item.id + '-in-list').text(textDisplay);
    });

    that.model.deletedItem.attach(function (data) {
        \$('#${classNameLowerCase}' + data.item.id + '-in-list').parents('li').remove();
    });

    // user interface actions
    <% if (geolocated) { %>
    \$('#list-all-${classNameLowerCase}s').live('click tap', function (e, ui) {
        hideMapDisplay();
        showListDisplay();
    });

    \$('#map-all-${classNameLowerCase}s').live('click tap', function (e, ui) {
        hideListDisplay();
        showMapDisplay();
    });
    <% } %>
    that.elements.list.live('pageinit', function (e) {
        that.listButtonClicked.notify();
    });

    that.elements.save.live("click tap", function () {
        var obj = grails.mobile.helper.toObject(\$("#form-update-${classNameLowerCase}").find("input, select"));
        var newElement = {
            ${classNameLowerCase}: JSON.stringify(obj)
        };
        if (obj.id === "") {
            that.createButtonClicked.notify(newElement);
        } else {
            that.updateButtonClicked.notify(newElement);
        }
    });

    that.elements.remove.live("click tap", function () {
        that.deleteButtonClicked.notify({ id: \$('#input-${classNameLowerCase}-id').val() });
    });

    // Detect online/offline from browser
    addEventListener('offline', function(e) {
        that.offlineEvent.notify();
    });

    addEventListener('online', function(e) {
        that.onlineEvent.notify();
    });

    // Detect online/offline from application
    \$("#offline").live("click tap", function () {
        that.offlineEvent.notify();
    });

    \$("#online").live("click tap", function () {
        that.onlineEvent.notify();
    });

    that.elements.add.live('pageshow', function (e) {
        var url = \$(e.target).attr("data-url");
        var matches = url.match(/\\?id=(.*)/);

        if (matches) {
            showElement(matches[1]);
        } else {
            createElement();
        }
    });

    var createElement = function () {
        resetForm("form-update-${classNameLowerCase}");
        <% if (geolocated) { %>
        navigator.geolocation.getCurrentPosition(function (position) {
            \$("#input-${classNameLowerCase}-latitude").val(position.coords.latitude);
            \$("#input-${classNameLowerCase}-longitude").val(position.coords.longitude);
            mapServiceForm.showMap("map-canvas-form", position.coords.latitude, position.coords.longitude, true);
        });
        <% } %>
        \$("#delete-${classNameLowerCase}").hide();
    };

    var showElement = function (id) {
        resetForm("form-update-${classNameLowerCase}");
        var element = that.model.items[id];
        \$.each(element, function (name, value) {
            \$('#input-${classNameLowerCase}-' + name).val(value);
        });
        <% if (geolocated) { %>
        mapServiceForm.showMap("map-canvas-form", element.latitude, element.longitude, true);
        <% } %>
        \$("#delete-${classNameLowerCase}").show();
    };

    var resetForm = function (form) {
        var div = \$("#" + form);
        div.find('input:text, input:hidden, input[type="number"], input:file, input:password').val('');
        div.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected').checkboxradio('refresh');
    };
    <% if (geolocated) { %>
    var hideListDisplay = function () {
        \$('#list-${classNameLowerCase}s-parent').removeClass('visible');
        \$('#list-${classNameLowerCase}s-parent').addClass('invisible');
    };

    var showMapDisplay = function () {
        \$('#map-${classNameLowerCase}s-parent').removeClass('invisible');
        \$('#map-${classNameLowerCase}s-parent').addClass('visible');
    };

    var  showListDisplay = function () {
        \$('#list-${classNameLowerCase}s-parent').removeClass('invisible');
        \$('#list-${classNameLowerCase}s-parent').addClass('visible');
    };

    var hideMapDisplay = function () {
        \$('#map-${classNameLowerCase}s-parent').removeClass('visible');
        \$('#map-${classNameLowerCase}s-parent').addClass('invisible');
    };
    <% } %>

    var renderList = function () {
        <% if (geolocated) { %>
        mapServiceList = grails.mobile.map.googleMapService();
        mapServiceList.emptyMap("map-canvas-list");
        <% } %>
        var key, items = model.getItems();
        for (key in items) {
            renderElement(items[key]);
        }
        \$('#list-${classNameLowerCase}s').listview('refresh');
        <% if (geolocated) { %>
        mapServiceList.refreshCenterZoomMap();
        <% } %>
    };

    var renderElement = function (element) {
        if (element.offlineStatus !== 'delete') {
            var a = \$('<a>').attr({ href: '#section-show-${classNameLowerCase}?id=' + element.id });
            a.attr({id : '${classNameLowerCase}' + element.id + '-in-list'});
            a.attr({'data-transition': 'fade' });
            a.text(getText(element));
            \$("#list-${classNameLowerCase}s").append(\$('<li>').append(a));
            <% if (geolocated) { %>
            mapServiceList.addMarkers(element);
            <% } %>
        }
    };

    var getText = function (data) {
        var textDisplay = '';
        \$.each(data, function (name, value) {
            if (name !== 'class' && name !== 'id' && name !== 'offlineStatus' && name !== 'status' && name !== 'version') {
                textDisplay += value + ";";
            }
        });
        return textDisplay.substring(0, textDisplay.length - 1);
    };

    return that;
};