/** Copyright 2012 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 * @author <a href='mailto:th33musk3t33rs@gmail.com'>3.musket33rs</a>
 *
 * @since 0.1
 */

import grails.util.GrailsNameUtils

includeTargets << grailsScript("_GrailsCreateArtifacts")
includeTargets << grailsScript("_GrailsBootstrap")
includeTargets << grailsScript('_GrailsPackage')

// default values
generateForName = null
htmlViewName = null
generateViews = true
generateController = true

target(generateForOne: 'Generates controllers and views for only one domain class.') {
    depends compile, loadApp
    //println "::::::::2"
    def name = generateForName
    def viewName = htmlViewName

    name = name.indexOf('.') > 0 ? name : GrailsNameUtils.getClassNameRepresentation(name)

    def domainClass = grailsApp.getDomainClass(name)

    if (!domainClass) {
        grailsConsole.updateStatus 'Domain class not found in grails-app/domain, trying hibernate mapped classes...'
        bootstrap()
        domainClass = grailsApp.getDomainClass(name)
    }

    if (domainClass) {
        generateForDomainClass(domainClass, viewName)
        event 'StatusFinal', [ "Finished generation for domain class ${domainClass.fullName}" ]
    }
    else {
        event 'StatusFinal', [
                "No domain class found for name ${name}. Please try again and enter a valid domain class name"
        ]
        exit 1
    }
}

def initHtmlMobileTemplate(viewName) {
    //println ":::::::: before loading"
    def htmlTemplateGeneratorClass = classLoader.loadClass("org.grails.html.mobile.HtmlMobileTemplateGenerator")
    def templateGenerator = htmlTemplateGeneratorClass.newInstance(classLoader, viewName)

    //println ":::::::: after loading"

    templateGenerator.grailsApplication = grailsApp
    templateGenerator.pluginManager = pluginManager
    templateGenerator.event = event
    templateGenerator
}

def generateForDomainClass(domainClass, viewName) {
    def templateGenerator = initHtmlMobileTemplate viewName

    updateConfig()

    if (generateController) {
        event 'StatusUpdate', ["Generating controller for domain class ${domainClass.fullName}"]
        //println ">>>>>  " + templateGenerator.class.name
        templateGenerator.generateController(domainClass, basedir)
        templateGenerator.generateEvents(domainClass, basedir)
        templateGenerator.generateIndex(basedir, domainClass)
        event 'GenerateControllerEnd', [domainClass.fullName]
    }

    if (generateViews) {
        event 'StatusUpdate', ["Generating views for domain class ${domainClass.fullName}"]
        templateGenerator.generateViews(domainClass, basedir)
        event 'GenerateViewsEnd', [domainClass.fullName]
    }
}

def updateConfig() {
    def appDir = "$basedir/grails-app"
    def configFile = new File(appDir, 'conf/Config.groovy')
    if (configFile.exists()) {
        String content = configFile.text
        if (!content.contains('grails.converters.json.domain.include.version=true')) {
            configFile.withWriterAppend {
                it.writeLine '\n// Added by the Html5 Mobile Scaffolding plugin:'
                it.writeLine 'grails.converters.json.domain.include.version=true'
            }
        }
    }
}
