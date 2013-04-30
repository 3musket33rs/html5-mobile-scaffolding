<%
import org.codehaus.groovy.grails.commons.GrailsDomainClass
def uncapitalize(s) { s[0].toLowerCase() + s[1..-1]}
classNameLowerCase = uncapitalize(className)
projectName = project.replaceAll("[\\-]", "").toLowerCase()
%>var ${projectName} = ${projectName} || {};

${projectName}.load${classNameLowerCase} = (function () {
    ${projectName}.configuration.domain.push({
        name: '${classNameLowerCase}',
        view: {
            'list': \$('#section-list-${classNameLowerCase}'),
            'save': \$('#submit-${classNameLowerCase}'),
            'add': \$('#add-${classNameLowerCase}'),
            'show': \$('a[id^="${classNameLowerCase}-list-"]'),
            'remove': \$('#delete-${classNameLowerCase}')
        }<% if(oneToOneProps) { %>,
        hasOneRelations: [<%
            oneToOneProps.each {
                def referencedType = it.type.name
                if (referencedType.lastIndexOf('.') > 0) {
                    referencedType = referencedType.substring(referencedType.lastIndexOf('.')+1)
                }
                def referencedTypeToLowerCase = uncapitalize(referencedType)
        %> {type: '${referencedTypeToLowerCase}', name: '${it.name}'} <% if(it!=oneToOneProps.last()) { %>,<% } %><% } %>]<% }
        if(oneToManyProps) { %>,
        oneToManyRelations: [<% oneToManyProps.each { %> {type: '${uncapitalize(it.getReferencedDomainClass().getName())}', name: '${it.name}'}<%
        if(it!=oneToManyProps.last()) { %>,<% } } %> ] <% } %>,
        options: {
            offline: true,
            eventPush: true
        }

    });
}());
