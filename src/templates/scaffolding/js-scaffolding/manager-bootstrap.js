<%
projectName = project.replaceAll('[\\-]', '').toLowerCase()
%>var ${projectName} = ${projectName} || {};

${projectName}.load = (function () {
    var frameworkAreReady = function() {
        \$.mobile.phonegapNavigationEnabled = true;
        \$.mobile.buttonMarkup.hoverDelay = 50;
        init();
    };
    var mobileInitDeferred = \$.Deferred();
    \$(document).on("pageinit", function () {
        mobileInitDeferred.resolve();
    });

    var onLoadDeferred = \$.Deferred();
    \$(document).ready(function() {
        onLoadDeferred.resolve();
    });

    if (window.cordova) {
        var deviceReadyDeferred = \$.Deferred();
        var deviceReady = function() {
            deviceReadyDeferred.resolve();
        };
        document.addEventListener("deviceReady", deviceReady, false);
        \$.when(onLoadDeferred, deviceReadyDeferred, mobileInitDeferred).then(frameworkAreReady);

    } else {
        \$.when(onLoadDeferred, mobileInitDeferred).then(frameworkAreReady);
    }

    var init = function() {
        var managerObject = grails.mobile.mvc.manager(${projectName}.configuration);
        managerObject.domainsObjects[threecirclesweb5.mainView].view.init();
    }
}());
