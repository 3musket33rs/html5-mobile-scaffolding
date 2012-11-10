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

    <% if(oneToOneProps || oneToManyProps) { %>
    that.model.listedDependentItems.attach(function (data) {
        if (data.relationType === 'many-to-one') {
            renderDependentList(data.dependentName, data.items);
        }
        if (data.relationType === 'one-to-many') {
            renderMultiChoiceDependentList(data.dependentName, data.items);
        }
    });
    <% } %>
    that.model.listedItems.attach(function (data) {
        renderList();
    });

    that.model.createdItem.attach(function (data) {
        renderElement(data.item);
        \$('#list-${classNameLowerCase}s').listview('refresh');
    	<% if (geolocated) { %>        
        mapServiceList.refreshCenterZoomMap();
		<% } %>
    });

    that.model.updatedItem.attach(function (data) {
         renderList();
    });

    that.model.deletedItem.attach(function (data) {
        \$('#${classNameLowerCase}' + data.item.id + '-in-list').parents('li').remove();
        <% if (geolocated) { %>
        mapServiceList.removeMarker(data.item.id);
        mapServiceList.refreshCenterZoomMap();
        <% } %>
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

        that.editButtonClicked.notify();

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
            var coord = {
                latitude : \$("#input-${classNameLowerCase}-latitude"),
                longitude :\$("#input-${classNameLowerCase}-longitude")
            };
            mapServiceForm.showMap("map-canvas-form", position.coords.latitude, position.coords.longitude, coord);
        });
        <% } %>
        \$("#delete-${classNameLowerCase}").hide();
    };

    var showElement = function (id) {
        resetForm("form-update-${classNameLowerCase}");
        var element = that.model.items[id];
 <% if(oneToOneProps) {
    oneToOneProps.each {
         def referencedType = it.type.name
         if (referencedType.lastIndexOf('.') > 0) {
    referencedType = referencedType.substring(referencedType.lastIndexOf('.')+1)
    }
def referencedTypeToLowerCase = referencedType.toLowerCase()
%>
        \$('select[data-gorm-relation="many-to-one"][name="${it.name}"]').val(element.${it.name}.id);
        \$('select[data-gorm-relation="many-to-one"][name="${it.name}"]').selectmenu('refresh');
 <% }
  } %>
 <% if(oneToManyProps) {
    oneToManyProps.each {
        def attributeName = it.name.toLowerCase(); %>
        var ${attributeName}Selected = element.${attributeName};
        \$.each(${attributeName}Selected, function (key, value) {
            var selector = '#checkbox-${attributeName}-' + value.id
            \$(selector).attr('checked','checked');
        })
  <% }
  } %>
        \$.each(element, function (name, value) {
            \$('#input-${classNameLowerCase}-' + name).val(value);
        });
        <% if (geolocated) { %>
        var coord = {
            latitude : \$("#input-${classNameLowerCase}-latitude"),
            longitude :\$("#input-${classNameLowerCase}-longitude")
        };
        mapServiceForm.showMap("map-canvas-form", element.latitude, element.longitude, coord);
        <% } %>
        \$("#delete-${classNameLowerCase}").show();
    };

    var resetForm = function (form) {
        var div = \$("#" + form);
        div.find('input:text, input:hidden, input[type="number"], input:file, input:password').val('');
        div.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');//.checkboxradio('refresh');
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
        mapServiceList.emptyMap("map-canvas-list");
        <% } %>
        \$('#list-${classNameLowerCase}s').empty();
        var key, items = model.getItems();
        for (key in items) {
            renderElement(items[key]);
        }
        \$('#list-${classNameLowerCase}s').listview('refresh');
        <% if (geolocated) { %>
        mapServiceList.refreshCenterZoomMap();
        <% } %>
    };


    <% if(oneToOneProps || oneToManyProps) { %>
    var refreshSelectDropDown = function (select, newOptions) {
        var options = null;
        if(select.prop) {
            options = select.prop('options');
        }
        else {
            options = select.attr('options');
        }
        \$('option', select).remove();

        \$.each(newOptions, function(val, text) {
            options[options.length] = new Option(text, val);
        });
        select.val(options[0]);
        select.selectmenu('refresh');
    }

     var renderDependentList = function (dependentName, items) {

        var manyToOneSelectForDependent = \$('select[data-gorm-relation="many-to-one"][name=' + dependentName + ']');
        var options = {};
        \$.each(items, function() {
            var key = this.id;
            var value = this[Object.keys(this)[2]];;
            options[key] = value;
            });

        refreshSelectDropDown(manyToOneSelectForDependent, options);
    };


    var refreshMultiChoices = function (oneToMany, dependentName, newOptions) {
        oneToMany.empty();
        \$.each(newOptions, function(key, val) {
            oneToMany.append(\$('<input type="checkbox" data-gorm-relation="one-to-many" name="'+ dependentName +'" id="checkbox-'+ dependentName +'-' + key + '"/><label for="checkbox-'+ dependentName +'-'+key+'">'+val+'</label>'));
        });
    }

    var renderMultiChoiceDependentList = function (dependentName, items) {
        var oneToMany = \$('#multichoice-' + dependentName);
        var options = {};
        \$.each(items, function() {
            var key = this.id;
            var value = this[Object.keys(this)[2]];
            options[key] = value;
        });

        refreshMultiChoices(oneToMany, dependentName, options);
    };
<% } %>

    var renderElement = function (element) {
        if (element.offlineAction !== 'DELETED') {
            var a = \$('<a>').attr({ href: '#section-show-${classNameLowerCase}?id=' + element.id });
            a.attr({id : '${classNameLowerCase}' + element.id + '-in-list'});
            a.attr({'data-transition': 'fade' });
            a.text(getText(element));
            if (element.offlineStatus === "NOT-SYNC") {
                \$("#list-${classNameLowerCase}s").append(\$('<li data-theme="e">').append(a));
            } else {
                \$("#list-${classNameLowerCase}s").append(\$('<li>').append(a));
            }
            <% if (geolocated) { %>
            var id = element.id;
            mapServiceList.addMarker(element, getText(element), function () {
                \$("#${classNameLowerCase}" + id + "-in-list").click();
            });
            <% } %>
        }
    };

    var getText = function (data) {
        var textDisplay = '';
        \$.each(data, function (name, value) {
            if (name !== 'class' && name !== 'id' && name !== 'offlineAction' && name !== 'offlineStatus' && name !== 'status' && name !== 'version') {
                if (typeof value !== 'object') {   // do not display relation in list view
                    textDisplay += value + " - ";
                }
            }
        });
        return textDisplay.substring(0, textDisplay.length - 2);
    };

    return that;
};