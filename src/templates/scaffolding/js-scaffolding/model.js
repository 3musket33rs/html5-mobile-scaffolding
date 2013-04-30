<%
import org.codehaus.groovy.grails.commons.GrailsDomainClass
def uncapitalize(s) { s[0].toLowerCase() + s[1..-1]}
classNameLowerCase = uncapitalize(className)
projectName = project.replaceAll("[\\-]", "").toLowerCase()
%>var ${projectName} = ${projectName} || {};
${projectName}.model = ${projectName}.model || {};

${projectName}.model.${classNameLowerCase}model = function () {

    var that = grails.mobile.mvc.model();

    //Place your custom event here
//    that.somethingHappened = grails.mobile.event(that);
//    that.something = function (item, context) {
//    };

    return that;
};