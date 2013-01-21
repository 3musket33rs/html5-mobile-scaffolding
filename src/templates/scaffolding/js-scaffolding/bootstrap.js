<%
    import org.codehaus.groovy.grails.commons.GrailsDomainClass
    classNameLowerCase = className.toLowerCase()
%>var ${packageName} = ${packageName} || {};

${packageName}.load${classNameLowerCase} = (function () {
    ${packageName}.configuration.domain.push({
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
                def referencedTypeToLowerCase = referencedType.toLowerCase()
        %> {type: '${referencedTypeToLowerCase}', name: '${it.name}'} <% if(it!=oneToOneProps.last()) { %>,<% } %><% } %>]<% }
        if(oneToManyProps) { %>,
        oneToManyRelations: [<% oneToManyProps.each { %> {type: '${it.getReferencedDomainClass().getName().toLowerCase()}', name: '${it.name}'}<%
        if(it!=oneToManyProps.last()) { %>,<% } } %> ] <% } %>,
        options: {
            offline: true,
            eventPush: true
        }

    });
}());
