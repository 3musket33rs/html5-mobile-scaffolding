<% import org.codehaus.groovy.grails.commons.GrailsDomainClass %>
<%
def uncapitalize(s) { s[0].toLowerCase() + s[1..-1]}
classNameLowerCase = uncapitalize(className)
%>
events = {
    'save-${classNameLowerCase}' browser:true
    'update-${classNameLowerCase}' browser:true
    'delete-${classNameLowerCase}' browser:true
}