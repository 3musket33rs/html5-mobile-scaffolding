<% import org.codehaus.groovy.grails.commons.GrailsDomainClass %>
<% classNameLowerCase = className.toLowerCase() %>

var ${packageName} = ${packageName} || {};

${packageName}.load = (function () {

    var configuration = {
        baseURL: "http://localhost:8080/${project}/",
        namespace: "${packageName}",
        domain:[
            {
                name: "${classNameLowerCase}",
                view: {
                    'list': \$('#section-list-${classNameLowerCase}s'),
                    'save': \$("#submit-${classNameLowerCase}"),
                    'add': \$('#section-show-${classNameLowerCase}'),
                    'remove': \$("#delete-${classNameLowerCase}")
                }
            }
        ]
    };
    var managerObject = grails.mobile.mvc.manager(configuration);

}());

