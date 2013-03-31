<%
import org.codehaus.groovy.grails.commons.GrailsDomainClass
def uncapitalize(s) { s[0].toLowerCase() + s[1..-1]}
classNameLowerCase = uncapitalize(className)
projectName = project.toLowerCase()
%>var ${projectName} = ${projectName} || {};
${projectName}.controller = ${projectName}.controller || {};

${projectName}.controller.${classNameLowerCase}controller = function (feed, model, view) {
    var that = grails.mobile.mvc.controller(feed, model, view);

    //Place here your custom event
//    view.somethingButtonClicked.attach(function (item, context) {
//          // ....
//          // Notify the model
//          that.model.somethingHappened(data, context);
//    });

    return that;
};
