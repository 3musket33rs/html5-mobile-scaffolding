<%
    import org.codehaus.groovy.grails.commons.GrailsDomainClass
    classNameLowerCase = className.toLowerCase()
%>var ${packageName} = ${packageName} || {};

${packageName}.load = (function () {
    var managerObject = grails.mobile.mvc.manager(${packageName}.configuration);

}());

