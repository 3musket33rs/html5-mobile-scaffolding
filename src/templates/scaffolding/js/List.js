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

\$('#section-${classNameLowerCase}s').live('pageinit', function(e) {
	get${className}s();
});

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
	
	
	\$("#section-${classNameLowerCase}s").data('${className}_' + ${classNameLowerCase}.id, ${classNameLowerCase});
	\$(${classNameLowerCase}).bind("refresh-${classNameLowerCase}" + ${classNameLowerCase}.id + "-list", function(bind, new${className}) {
		var ${classNameLowerCase} = \$("#section-${classNameLowerCase}s").data('${className}_' + new${className}.id);
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
	});
	\$("#list-${classNameLowerCase}s").append(out);
}

function remove${className}OnSection(id) {
	var listID = '${classNameLowerCase}' + id + '-in-list';
	var link = \$("#" + listID);
	link.parents('li').remove();
	var ${classNameLowerCase} = \$("#section-${classNameLowerCase}s").data('${className}_' + id, ${classNameLowerCase});
	\$("#section-${classNameLowerCase}s").data('${className}_' + id, null);
	\$(${classNameLowerCase}).unbind();
	\$('#list-${classNameLowerCase}s').listview('refresh');
}

