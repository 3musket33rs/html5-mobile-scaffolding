<% classNameLowerCase = className.toLowerCase() %>
function ${className}List() {
	this.${classNameLowerCase}s = [];
}

${className}List.prototype.add = function(list${className}) {
	this.${classNameLowerCase}s = list${className};
};

${className}List.prototype.get = function(index) {
	return this.${classNameLowerCase}s[index];
};

serverUrl = 'http://localhost:8080/${project}';
//serverUrl = 'http://${project}.cloudfoundry.com'	
<% if (longitude && latitude) { %>
var global_map;
var pointMap = {}; 
<% } %>

\$('#section-list-${classNameLowerCase}s').live('pageinit', function(e) {
	<% if (longitude && latitude) { %>
	// Initialization of Map for list display
	var center = new google.maps.LatLng(0, 0);
	var myOptions = {
       zoom: 18,
	   center: center,
	   mapTypeId: google.maps.MapTypeId.ROADMAP
	};
    global_map = new google.maps.Map(document.getElementById("map-canvas-all"), myOptions);
	<% } %>
    // Get domain objects		
	get${className}s();
});

<% if (longitude && latitude) { %>
\$('#list-all-${classNameLowerCase}s').live('click tap', function(e, ui) {
	hideMapDisplay();
	showListDisplay();
});

\$('#map-all-${classNameLowerCase}s').live('click tap', function(e, ui) {
	hideListDisplay();
	showMapDisplay();
});

function hideListDisplay() {
	\$('#list-${classNameLowerCase}s-parent').removeClass('visible');
	\$('#list-${classNameLowerCase}s-parent').addClass('invisible');
}

function showMapDisplay() {
	\$('#map-${classNameLowerCase}s-parent').removeClass('invisible');
	\$('#map-${classNameLowerCase}s-parent').addClass('visible');
}

function showListDisplay() {
	\$('#list-${classNameLowerCase}s-parent').removeClass('invisible');
	\$('#list-${classNameLowerCase}s-parent').addClass('visible');
}

function hideMapDisplay() {
	\$('#map-${classNameLowerCase}s-parent').removeClass('visible');
	\$('#map-${classNameLowerCase}s-parent').addClass('invisible');
}
<% } %>

function get${className}s() {
	\$.ajax({
		cache : false,
		type : "GET",
		async : false,
		dataType : "jsonp",
		url : serverUrl + '/${classNameLowerCase}/list',
		success : function(data) {
			if (data) {
				var ${classNameLowerCase}List = new ${className}List();
				${classNameLowerCase}List.add(data);
				${classNameLowerCase}List.renderToHtml();
			}
		},
		error : function(xhr) {
			alert(xhr.responseText);
		}
	});
}

${className}List.prototype.renderToHtml = function() {
	var context = this.${classNameLowerCase}s;
	for ( var i = 0; i < context.length; i++) {
		var ${classNameLowerCase} = context[i];
		add${className}OnSection(${classNameLowerCase});
	}
	\$('#list-${classNameLowerCase}s').listview('refresh');
	<% if (longitude && latitude) { %>
	refreshCenterZoomMap();
	<% } %>
}


function add${className}OnSection (${classNameLowerCase}) {
	var out = '<li><a href="#section-show-${classNameLowerCase}?id='+ ${classNameLowerCase}.id + '" data-transition="fade" id="${classNameLowerCase}'; 
	out =  out + ${classNameLowerCase}.id + '-in-list">';
	
    <% props.eachWithIndex { p, i -> 
    	if (p.isEnum()) {
       %>out = out + ${classNameLowerCase}.${p.name}.name +';';
       <%  } else if (!p.isOneToOne()) {
       %>out = out + ${classNameLowerCase}.${p.name} +';';
       <%  }   }%>
	out = out + '</a></li>';
	
	\$("#section-list-${classNameLowerCase}s").data('${className}_' + ${classNameLowerCase}.id, ${classNameLowerCase});
	<% if (longitude && latitude) { %>
	var marker = addMarkers(${classNameLowerCase});
	<% } %>
	
	\$(${classNameLowerCase}).bind("refresh-${classNameLowerCase}" + ${classNameLowerCase}.id + "-list", function(bind, new${className}) {
		var ${classNameLowerCase} = \$("#section-list-${classNameLowerCase}s").data('${className}_' + new${className}.id);
		var textDisplay = "";
	    <% props.eachWithIndex { p, i ->
	    	if (p.isEnum()) {
	       %>textDisplay = textDisplay + new${className}.${p.name}.name +';';
	       <%  } else {
		   %>textDisplay = textDisplay + new${className}.${p.name} +';';
	       <%  }  }%>
		\$('#${classNameLowerCase}' + new${className}.id + '-in-list').text(textDisplay);
		for(var property in new${className}) {
			${classNameLowerCase}[property] = new${className}[property];
		}
		<% if (longitude && latitude) { %>
		var marker = pointMap['${className}_' + ${classNameLowerCase}.id + "_marker"];
		marker.setMap(null);
		var newMarker = addMarkers(new${className});
		refreshCenterZoomMap();
		<% } %>
	});
	\$("#list-${classNameLowerCase}s").append(out);
}
<% if (longitude && latitude) { %>
function addMarkers(${classNameLowerCase}) {
	var marker = new google.maps.Marker({
		   position: new google.maps.LatLng(${classNameLowerCase}.latitude, ${classNameLowerCase}.longitude),
		   map: global_map
		 });
	pointMap['${className}_' + ${classNameLowerCase}.id + "_marker"] = marker;
}

function refreshCenterZoomMap() {
	var bounds = new google.maps.LatLngBounds();
	
	var previousZoom = global_map.getZoom();

	for (var key in pointMap) {
		var marker = pointMap[key];
		bounds.extend(marker.getPosition());
	}
	global_map.setCenter(bounds.getCenter());
	global_map.fitBounds(bounds);

	zoomChangeBoundsListener = 
	  google.maps.event.addListenerOnce(global_map, 'bounds_changed', function(event) {
		  if (!this.getZoom()){
			  this.setZoom(previousZoom);
		  }	
	  });
	setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000);	
	
}
<% } %>

function remove${className}OnSection(id) {
	var listID = '${classNameLowerCase}' + id + '-in-list';
	var link = \$("#" + listID);
	link.parents('li').remove();
	var ${classNameLowerCase} = \$("#section-list-${classNameLowerCase}s").data('${className}_' + id, ${classNameLowerCase});
	\$("#section-list-${classNameLowerCase}s").removeData('${className}_' + id);
	\$(${classNameLowerCase}).unbind();
	\$('#list-${classNameLowerCase}s').listview('refresh');
	<% if (longitude && latitude) { %>
	var marker = pointMap['${className}_' + ${classNameLowerCase}.id + "_marker"];
	marker.setMap(null);
	delete pointMap['${className}_' + ${classNameLowerCase}.id + "_marker"];
	refreshCenterZoomMap();
	<% } %>
}

