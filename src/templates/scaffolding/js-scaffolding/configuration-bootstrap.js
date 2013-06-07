<%
projectName = project.replaceAll("[\\-]", "").toLowerCase()
%>var ${projectName} = ${projectName} || {};

${projectName}.loadConfiguration = (function () {
    ${projectName}.configuration = {
        baseURL: "http://localhost:8080/${project}/",
        //Uncomment for Android emulator localhost
        //baseURL: "http://10.0.2.2:8080/${project}/",
        //Uncomment before pushing to cloudfoundry
        //baseURL: "http://${project}.cloudfoundry.com/",
        namespace: "${projectName}",
        domain:[]
    };
})();

