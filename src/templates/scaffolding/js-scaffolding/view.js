<%
    import org.codehaus.groovy.grails.commons.GrailsDomainClass
def uncapitalize(s) { s[0].toLowerCase() + s[1..-1]}
classNameLowerCase = uncapitalize(className)
projectName = project.replaceAll("[\\-]", "").toLowerCase()
%>var ${projectName} = ${projectName} || {};
${projectName}.view = ${projectName}.view || {};

${projectName}.view.${classNameLowerCase}view = function (model, elements) {

    var that = grails.mobile.mvc.view(model, elements);<% if (geolocated) { %>
    var mapServiceList = grails.mobile.map.googleMapService();
    var mapServiceForm = grails.mobile.map.googleMapService();<% } %>
    <%  props.eachWithIndex { p, i ->
            if (p.type==([] as Byte[]).class || p.type==([] as byte[]).class) { %>
    \$(function () {
        grails.mobile.camera.getPicture(\$('#input-${classNameLowerCase}-${p.name}'));
    });
    <% } }%>
    // Register events
    that.model.listedItems.attach(function (data) {<% if (geolocated) { %>
        mapServiceList.emptyMap('map-canvas-list-${classNameLowerCase}');<% } %>
        \$('#list-${classNameLowerCase}').empty();
        var key, items = model.getItems();
        \$.each(items, function(key, value) {
            renderElement(value);
        });
        \$('#list-${classNameLowerCase}').listview('refresh');
        <% if (geolocated) { %>
        mapServiceList.refreshCenterZoomMap();<% } %>
    });

    that.model.createdItem.attach(function (data, event) {
        \$(that.elements.save).removeClass('ui-disabled');
        if (data.item.errors) {
            \$.each(data.item.errors, function(index, error) {
                \$('#input-${classNameLowerCase}-' + error.field).validationEngine('showPrompt',error.message, 'fail');
            });
            event.stopPropagation();
        } else if (data.item.message) {
            showGeneralMessage(data, event);
        } else {
            renderElement(data.item);
            \$('#list-${classNameLowerCase}').listview('refresh');
            if (!data.item.NOTIFIED) {
                \$.mobile.changePage(\$('#section-list-${classNameLowerCase}'));
            }
		}
    });

    that.model.updatedItem.attach(function (data, event) {
        \$(that.elements.save).removeClass('ui-disabled');
        if (data.item.errors) {
            \$.each(data.item.errors, function(index, error) {
                \$('#input-${classNameLowerCase}-' + error.field).validationEngine('showPrompt',error.message, 'fail');
            });
            event.stopPropagation();
        } else if (data.item.message) {
            showGeneralMessage(data, event);
        } else {
            updateElement(data.item);
            \$('#list-${classNameLowerCase}').listview('refresh');
            if (!data.item.NOTIFIED) {
                \$.mobile.changePage(\$('#section-list-${classNameLowerCase}'));
            }
        }
    });

    that.model.deletedItem.attach(function (data, event) {
        \$(that.elements.remove).removeClass('ui-disabled');
        if (data.item.message) {
            showGeneralMessage(data, event);
        } else {
            if (data.item.offlineStatus === 'NOT-SYNC') {
                \$('#${classNameLowerCase}-list-' + data.item.id).parents('li').replaceWith(createListItem(data.item));
            } else {
                \$('#${classNameLowerCase}-list-' + data.item.id).parents('li').remove();<% if (geolocated) { %>
                mapServiceList.removeMarker(data.item.id);<% } %>
            }
            \$('#list-${classNameLowerCase}').listview('refresh');
            if (!data.item.NOTIFIED) {
                \$.mobile.changePage(\$('#section-list-${classNameLowerCase}'));
            }
        }
    });<%
    if(oneToOneProps || oneToManyProps) {
    %>
    that.model.listedDependentItems.attach(function (data) {
        if (data.relationType === 'many-to-one') {
            renderDependentList(data.dependentName, data.items);
        }
        if (data.relationType === 'one-to-many') {
            renderMultiChoiceDependentList(data.dependentName, data.items);
        }
    });<% } %>

    // user interface actions<% if (geolocated) { %>
    \$('#section-list-${classNameLowerCase}').on('pageshow', function() {
        mapServiceList.refreshCenterZoomMap();
    });

    \$('#section-show-${classNameLowerCase}').on('pageshow', function() {
        if(\$('#input-${classNameLowerCase}-id').val() === ''){
            navigator.geolocation.getCurrentPosition(function (position) {
                var coord = {
                    latitude : \$('#input-${classNameLowerCase}-latitude'),
                    longitude :\$('#input-${classNameLowerCase}-longitude')
                };
                mapServiceForm.showMap('map-canvas-form-${classNameLowerCase}', position.coords.latitude, position.coords.longitude, coord);
                mapServiceForm.refreshCenterZoomMap();
            });
        } else {
            mapServiceForm.refreshCenterZoomMap();
        }
    });

    \$('#list-all-${classNameLowerCase}').on('vclick', function (e, ui) {
        hideMapDisplay();
        showListDisplay();
    });

    \$('#map-all-${classNameLowerCase}').on('vclick', function (e, ui) {
        hideListDisplay();
        showMapDisplay();
    });<% } %>
    that.elements.list.on('pageinit', function (e) {
        that.listButtonClicked.notify();
    });

    that.elements.save.on('vclick', function (event) {
        event.stopPropagation();
        \$('#form-update-${classNameLowerCase}').validationEngine('hide');
        if(\$('#form-update-${classNameLowerCase}').validationEngine('validate')) {
            \$(this).addClass('ui-disabled');
            var obj = grails.mobile.helper.toObject(\$('#form-update-${classNameLowerCase}').find('input, select'));
            var newElement = {
                ${classNameLowerCase}: JSON.stringify(obj)
            };
            if (obj.id === '') {
                that.createButtonClicked.notify(newElement, event);
            } else {
                that.updateButtonClicked.notify(newElement, event);
            }
        }
    });

    that.elements.remove.on('vclick', function (event) {
        \$(this).addClass('ui-disabled');
        event.stopPropagation();
        that.deleteButtonClicked.notify({ id: \$('#input-${classNameLowerCase}-id').val() }, event);
    });

    that.elements.add.on('vclick', function (event) {
        event.stopPropagation();
        \$('#form-update-${classNameLowerCase}').validationEngine('hide');
        \$('#form-update-${classNameLowerCase}').validationEngine({promptPosition: 'bottomLeft'});<% if(oneToOneProps || oneToManyProps) { %>
        that.editButtonClicked.notify();<%}%>
        createElement();
    });

    var show = function(dataId, event) {
        event.stopPropagation();
        \$('#form-update-${classNameLowerCase}').validationEngine('hide');
        \$('#form-update-${classNameLowerCase}').validationEngine({promptPosition: 'bottomLeft'});<% if(oneToOneProps || oneToManyProps) { %>
        that.editButtonClicked.notify();<%}%>
        showElement(dataId);
    };

    var createElement = function () {
        resetForm('form-update-${classNameLowerCase}');
        \$.mobile.changePage(\$('#section-show-${classNameLowerCase}'));
        \$('#delete-${classNameLowerCase}').css('display', 'none');
    };

    var showElement = function (id) {
        resetForm('form-update-${classNameLowerCase}');
        var element = that.model.items[id];<% if(oneToOneProps) {
               oneToOneProps.each {
               def referencedType = it.type.name
               if (referencedType.lastIndexOf('.') > 0) {
                   referencedType = referencedType.substring(referencedType.lastIndexOf('.')+1)
               }
               def referencedTypeToLowerCase = uncapitalize(referencedType)
        %>
        var value = element['${it.name}.id'];
        if (!value) {
            value = element['${it.name}'];
        }
        if (!value || (value === Object(value))) {
           value = element.${it.name}.id;
        }
        \$('select[data-gorm-relation="many-to-one"][name="${it.name}"]').val(value).trigger("change");
        <% } } %><% if(oneToManyProps) {
    oneToManyProps.each {
        def attributeName = uncapitalize(it.name); %>
        var ${attributeName}Selected = element.${attributeName};
        \$.each(${attributeName}Selected, function (key, value) {
            var selector;
            if (value === Object(value)) {
              selector= '#checkbox-${attributeName}-' + value.id;
            } else {
              selector= '#checkbox-${attributeName}-' + value;
            }
            \$(selector).attr('checked','checked').checkboxradio('refresh');
        });<% } } %>
        \$.each(element, function (name, value) {
            var input = \$('#input-${classNameLowerCase}-' + name);
            if (input.attr('type') != 'file') {
                input.val(value);
            } else {
                if (value) {
                    var img = grails.mobile.camera.encode(value);
                    input.parent().css('background-image', 'url("' + img + '")');
                    input.attr('data-value', img);
                }
            }
            if (input.attr('data-type') == 'date') {
                input.scroller('setDate', (value === '') ? '' : new Date(value), true);
            }
        });<% if (geolocated) { %>
        var coord = {
            latitude : \$('#input-${classNameLowerCase}-latitude'),
            longitude :\$('#input-${classNameLowerCase}-longitude')
        };
        mapServiceForm.showMap('map-canvas-form-${classNameLowerCase}', element.latitude, element.longitude, coord);<% } %>
        \$('#delete-${classNameLowerCase}').show();
        \$.mobile.changePage(\$('#section-show-${classNameLowerCase}'));
    };

    var resetForm = function (form) {
        \$('input[data-type="date"]').each(function() {
            \$(this).scroller('destroy').scroller({
                preset: 'date',
                theme: 'default',
                display: 'modal',
                mode: 'scroller',
                dateOrder: 'mmD ddyy'
            });
        });
        var div = \$("#" + form);
        if(div) {
            if (div[0]) {
                div[0].reset();
            }
            \$.each(div.find('input:hidden'), function(id, input) {
                if (\$(input).attr('type') != 'file') {
                    \$(input).val('');
                } else {
                    \$(input).parent().css('background-image', 'url("images/camera.png")');
                    \$(input).attr('data-value', '');
                }
            });
        }
    };
    <% if (geolocated) { %>
    var hideListDisplay = function () {
        \$('#list-${classNameLowerCase}-parent').css('display', 'none');
    };

    var showMapDisplay = function () {
        \$('#map-${classNameLowerCase}-parent').css('display', '');
        mapServiceList.refreshCenterZoomMap();
    };

    var  showListDisplay = function () {
        \$('#list-${classNameLowerCase}-parent').css('display', '');
    };

    var hideMapDisplay = function () {
        \$('#map-${classNameLowerCase}-parent').css('display', 'none');
    };
    <% }
    if(oneToOneProps || oneToManyProps) { %>

    var refreshSelectDropDown = function (select, newOptions) {
        var options = null;
        if(select.prop) {
            options = select.prop('options');
        } else {
            options = select.attr('options');
        }
        if (options) {
            \$('option', select).remove();
            \$.each(newOptions, function(val, text) {
                options[options.length] = new Option(text, val);
            });
            select.val(options[0]);
        }
    };

    var renderDependentList = function (dependentName, items) {
        var manyToOneSelectForDependent = \$('select[data-gorm-relation="many-to-one"][name=' + dependentName + ']');
        var options = {};
        \$.each(items, function() {
            var key = this.id;
            var value = getText(this);
            options[key] = value;
        });
        refreshSelectDropDown(manyToOneSelectForDependent, options);
    };

    var refreshMultiChoices = function (oneToMany, dependentName, newOptions) {
        oneToMany.empty();
        \$.each(newOptions, function(key, val) {
            oneToMany.append('<input type="checkbox" data-gorm-relation="one-to-many" name="'+ dependentName +'" id="checkbox-'+ dependentName +'-' + key + '"/><label for="checkbox-'+ dependentName +'-'+key+'">'+val+'</label>');
        });
        oneToMany.parent().trigger('create');
    };

    var renderMultiChoiceDependentList = function (dependentName, items) {
        var oneToMany = \$('#multichoice-' + dependentName);
        var options = {};
        \$.each(items, function() {
            var key = this.id;
            var value = getText(this);
            options[key] = value;
        });
        refreshMultiChoices(oneToMany, dependentName, options);
    };
    <% } %>
    var createListItem = function (element) {
        var li, a = \$('<a>');
        a.attr({
            id : '${classNameLowerCase}-list-' + element.id,
            'data-id' : element.id,
            'data-transition': 'fade'
        });
        a.text(getText(element));
        a.on('vclick', function(event) {
            show(element.id, event);
        });
        <%
            props.eachWithIndex { p, i ->
            if (p.type==([] as Byte[]).class || p.type==([] as byte[]).class) {
        %>
        if(element.${p.name}) {
            var image = '<img src="'+ grails.mobile.camera.encode(element.${p.name}) +'"/>';
            a.append(image);
        }
        <% } } %>
        if (element.offlineStatus === 'NOT-SYNC') {
            li =  \$('<li>').attr({'data-theme': 'e'});
            li.append(a);
        } else {
            li = \$('<li>').append(a);
        }<% if (geolocated) { %>
        var id = element.id;
        mapServiceList.addMarker(element, getText(element), function () {
            \$('#${classNameLowerCase}-list-' + id).click();
        });<% } %>
        return li;
    };

    var renderElement = function (element) {
        \$('#list-${classNameLowerCase}').append(createListItem(element));
    };

    var updateElement = function (element) {
        <% if (geolocated) { %>mapServiceList.removeMarker(element.id);
        <% } %>\$('#${classNameLowerCase}-list-' + element.id).parents('li').replaceWith(createListItem(element));
    };

    var getText = function (data) {
        var textDisplay = '';
        \$.each(data, function (name, value) {
            if (name !== 'class' && name !== 'id' && name !== 'offlineAction' && name !== 'offlineStatus'
                && name !== 'status' && name !== 'version' && name != 'longitude' && name != 'latitude'
                && name != 'NOTIFIED') {
                if (typeof value !== 'object') {   // do not display relation in list view
                    textDisplay += value + ' - ';
                }
            }
        });
        return textDisplay.substring(0, textDisplay.length - 2);
    };

    var showGeneralMessage = function(data, event) {
        \$.mobile.showPageLoadingMsg( \$.mobile.pageLoadErrorMessageTheme, data.item.message, true );
        setTimeout( \$.mobile.hidePageLoadingMsg, 3000 );
        event.stopPropagation();
    };

    return that;
};
