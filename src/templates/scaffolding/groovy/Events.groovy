<% import org.codehaus.groovy.grails.commons.GrailsDomainClass %>
<% classNameLowerCase = className.toLowerCase() %>
events = {
    'save-${classNameLowerCase}' browser:true
    'update-${classNameLowerCase}' browser:true
    'delete-${classNameLowerCase}' browser:true
}