<% import org.codehaus.groovy.grails.commons.GrailsDomainClass %>
<% classNameLowerCase = className.toLowerCase() %>
function ${className}() {
	this.${classNameLowerCase} = [];
}

\$('#section-show-${classNameLowerCase}').live('pageshow', function(e) {
	var url = \$(e.target).attr("data-url");
	var matches = url.match(/\\?id=(.*)/);
	<% oneToOneProps.each { 
		  def referencedType = it.type.name
		  if (referencedType.lastIndexOf('.') > 0) {
			  referencedType = referencedType.substring(referencedType.lastIndexOf('.')+1)
		  }
		 def referencedTypeToLowerCase = referencedType.toLowerCase()
    %>
    get${referencedType}s();
    <% } %>
	if (matches != null) {
		show${className}(matches[1]);
	} else {
		create${className}();
	}
});

<% if (oneToOneProps) { %>
function _refreshSelectDropDown(select, newOptions) {
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
<% oneToOneProps.each { 
	  def referencedType = it.type.name
	  if (referencedType.lastIndexOf('.') > 0) {
		  referencedType = referencedType.substring(referencedType.lastIndexOf('.')+1)
	  }
	 def referencedTypeToLowerCase = referencedType.toLowerCase()
%>
function get${referencedType}s() {
	\$.ajax({
		cache : false,
		type : "GET",
		async : false,
		dataType : "jsonp",
		url : serverUrl + '/${referencedTypeToLowerCase}/list',
		success : function(data) {
			if (data) {
				var options = new Object();
				\$.each(data, function(val, text) {
				   var key = this.id;
				   <% GrailsDomainClass domainClassAssociation = it.getReferencedDomainClass()
				      def firstAttribute = domainClassAssociation.properties[0].name	 %>			
				   var value = this.${firstAttribute};
				   options[key] = value;
				});
				var manyToOneSelectFor${referencedType} = \$('select[data-gorm-relation="many-to-one"][name="${referencedTypeToLowerCase}"]');
				_refreshSelectDropDown(manyToOneSelectFor${referencedType}, options)
			}
		},
		error : function(xhr) {
			alert(xhr.responseText);
		}
	});
}
<% } %>
<% } %>

function create${className}() {
	resetForm("form-update-${classNameLowerCase}");
    <%  props.eachWithIndex { p, i ->
    if (p.isEnum()) { %>	
	\$('input[name="${p.name}"]:first').prop('checked', true);
	\$('input[name="${p.name}"]:first').checkboxradio('refresh');
    <%  }  }%>	
    
    <% if (longitude && latitude) { %>
    navigator.geolocation.getCurrentPosition(foundLocation);
    <% } %>
    <% geoProps.each { %>
    navigator.geolocation.getCurrentPosition(foundLocationForMongoDB);
    <% } %>
    
	\$("#delete-${classNameLowerCase}").hide();
}

<% geoProps.each { %>
function foundLocationForMongoDB(position) {
	 \$("#input-${classNameLowerCase}-${it.key}").val({lat: position.coords.latitude, long:position.coords.longitude});
}
<% } %>

<% if (longitude && latitude) { %>
function foundLocation(position) {
	 \$("#input-${classNameLowerCase}-latitude").val(position.coords.latitude);
	 \$("#input-${classNameLowerCase}-longitude").val(position.coords.longitude);
}

function showMap(lat,lng) {
	 var latlng = new google.maps.LatLng(lat, lng);
	 var myOptions = {
       zoom: 18,
	   center: latlng,
	   mapTypeId: google.maps.MapTypeId.ROADMAP
	 };
	 var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
	 var marker = new google.maps.Marker({
  	   position: new google.maps.LatLng(lat, lng),
	   map: map
	 });
}
<% } %>

function show${className}(id) {
	resetForm("form-update-${classNameLowerCase}");
	var ${classNameLowerCase} = \$("#section-${classNameLowerCase}s").data("${className}_" + id);
    <% props.eachWithIndex { p, i ->
    if (p.type == Boolean || p.type == boolean) { %>
	\$('#input-${classNameLowerCase}-${p.name}').prop('checked', ${classNameLowerCase}.${p.name});
	\$('#input-${classNameLowerCase}-${p.name}').checkboxradio('refresh');
    <%  } else if (p.isEnum()) {%>
	\$('#input-${classNameLowerCase}-${p.name}-' + ${classNameLowerCase}.${p.name}.name).prop('checked', true);
	\$('#input-${classNameLowerCase}-${p.name}-' + ${classNameLowerCase}.${p.name}.name).checkboxradio('refresh');
    <%  } else if(p.isOneToOne()) {   %>
	\$('select[data-gorm-relation="many-to-one"][name="${p.name}"]').val(${classNameLowerCase}.${p.name}.id);
	\$('select[data-gorm-relation="many-to-one"][name="${p.name}"]').selectmenu('refresh');
    <% } else { %>
	\$('#input-${classNameLowerCase}-${p.name}').val(${classNameLowerCase}.${p.name});
    <%  }  }%>
	\$('#input-${classNameLowerCase}-id').val(${classNameLowerCase}.id);
	\$('#input-${classNameLowerCase}-version').val(${classNameLowerCase}.version);
	\$('#input-${classNameLowerCase}-class').val(${classNameLowerCase}.class);
	<% if (longitude && latitude) { %>
    navigator.geolocation.getCurrentPosition(foundLocation);
    showMap(${classNameLowerCase}.latitude, ${classNameLowerCase}.longitude)
	<% } %>	
	\$("#delete-${classNameLowerCase}").show();
}

${className}.prototype.renderToHtml = function() {
};

function resetForm(form) {
	var div = \$("#" + form);
	div.find('input:text, input:hidden, input[type="number"], input:file, input:password').val('');
	div.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected').checkboxradio('refresh');
}

function serializeObject(inputs) {
	var arrayData, objectData;
	arrayData = inputs;
	objectData = {};

	\$.each(arrayData, function() {
		var value, classtype;
		var add = true;
		if (this.type == 'select-one') {
			value = \$(this).val();
		} else if (this.type == 'radio') {
			if (\$(this).is(':checked')) {
				value = this.value;
			} else {
				add = false;
			}
		} else if (this.type == 'checkbox') {
			value = this.checked;
		} else {
			if (\$(this).attr('data-role') == 'calbox') {
				value = \$(this).data('calbox').theDate;
			} else if (this.value != null) {
				value = this.value;
			} else {
				value = '';
			}
		}
		if (add) {
			if (\$(this).attr('data-gorm-relation') == "many-to-one") {
				objectData[this.name+'.id'] = value; 
			} else {
				objectData[this.name] = value;
			}
		}
	});

	return objectData;
}


\$("#submit-${classNameLowerCase}").live("click tap", function() {
	var div = \$("#form-update-${classNameLowerCase}");
	var inputs = div.find("input, select");
	var obj = serializeObject(inputs);
	var action = "update";
	if (obj.id == "") {
		action= "save";
	}
	var txt = {
		${classNameLowerCase} : JSON.stringify(obj)
	};

	\$.ajax({
		cache : false,
		type : "POST",
		async : false,
		data : txt,
		dataType : "jsonp",
		url : serverUrl + '/${classNameLowerCase}/' + action,
		success : function(data) {
			if (data.message) {
				alert(data.message)
				return;
			}
			if (data.errors) {
				// Here I need to add to field mapping for errors
				alert("validation issue" + data.errors)
				return;
			}
			if (action == "save") {
				add${className}OnSection(data);
				\$('#list-${classNameLowerCase}s').listview('refresh');
			} else {
				var ${classNameLowerCase} = \$("#section-${classNameLowerCase}s").data('${className}_' + data.id);
				\$(${classNameLowerCase}).trigger("refresh-${classNameLowerCase}"+ data.id + "-list", data);
			}
		},
		error : function(xhr) {
			alert(xhr.responseText);
		}
	});

});


\$("#delete-${classNameLowerCase}").live("click tap", function() {
	var ${classNameLowerCase}Id = \$('#input-${classNameLowerCase}-id').val();
	var txt = { id : ${classNameLowerCase}Id };
	\$.ajax({
		cache : false,
		type : "POST",
		async : false,
		data : txt,
		dataType : "jsonp",
		url : serverUrl + '/${classNameLowerCase}/delete',
		success : function(data) {
			if (data.message) {
				alert(data.message)
				return;
			}
			remove${className}OnSection(data.id);
		},
		error : function(xhr) {
			alert(xhr.responseText);
		}
	});
});