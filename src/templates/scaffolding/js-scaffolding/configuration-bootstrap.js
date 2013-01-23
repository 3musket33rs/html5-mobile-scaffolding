<%
    import org.codehaus.groovy.grails.commons.GrailsDomainClass
    classNameLowerCase = className.toLowerCase()
%>var ${packageName} = ${packageName} || {};

${packageName}.loadConfiguration = (function () {
    ${packageName}.configuration = {
        baseURL: "http://localhost:8080/${project}/",
        //Uncomment before pushing to cloudfoundry
        //baseURL: "http://${project}.cloudfoundry.com/",
        namespace: "${packageName}",
        domain:[]
    };
})();

