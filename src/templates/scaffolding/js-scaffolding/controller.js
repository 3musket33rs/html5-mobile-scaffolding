<%
import org.codehaus.groovy.grails.commons.GrailsDomainClass
def uncapitalize(s) { s[0].toLowerCase() + s[1..-1]}
classNameLowerCase = uncapitalize(className)
projectName = project.replaceAll("[\\-]", "").toLowerCase()
%>var ${projectName} = ${projectName} || {};
${projectName}.controller = ${projectName}.controller || {};

${projectName}.controller.${classNameLowerCase}controller = function (feed, model, view, cfg) {
    var that = grails.mobile.mvc.controller(feed, model, view, cfg);

    //Place here your custom event
//    view.somethingButtonClicked.attach(function (item, context) {
//          // ....
//          // Notify the model
//          that.model.somethingHappened(data, context);
//    });

    return that;
};
