<%
projectName = project.toLowerCase()
%>var ${projectName} = ${projectName} || {};

${projectName}.load = (function () {
    var managerObject = grails.mobile.mvc.manager(${projectName}.configuration);

}());

