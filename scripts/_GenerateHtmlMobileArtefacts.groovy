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
import org.codehaus.groovy.grails.commons.GrailsDomainClass
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.support.PathMatchingResourcePatternResolver
import org.springframework.util.Assert
import org.codehaus.groovy.grails.scaffolding.*
import grails.persistence.Event

includeTargets << grailsScript("_GrailsCreateArtifacts")
includeTargets << grailsScript("_GrailsGenerate")
includeTargets << grailsScript("_GrailsBootstrap")
includeTargets << grailsScript('_GrailsPackage')

// default values
generateForName = null
htmlViewName = null
generateViews = true
generateController = true

target(generateForOne: 'Generates controllers and views for only one domain class.') {
    depends compile, loadApp

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

HtmlMobileTemplateGenerator initHtmlMobileTemplate(viewName) {
    def templateGenerator = new HtmlMobileTemplateGenerator(classLoader, viewName)
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

class HtmlMobileTemplateGenerator extends DefaultGrailsTemplateGenerator {

    def event
    def viewName



    HtmlMobileTemplateGenerator(ClassLoader classLoader, String viewName) {
        super(classLoader)
        this.viewName = viewName
    }

    def uncapitalize(s) { s[0].toLowerCase() + s[1..-1]}

    void generateEvents(GrailsDomainClass domainClass, String destdir) {
        Assert.hasText destdir, "Argument [destdir] not specified"

        if (domainClass) {
            def destFile = new File("${destdir}/grails-app/conf/${domainClass.shortName}Events.groovy")
            destFile.withWriter { w ->
                generateEvents(domainClass, w)
            }
            LOG.info("Events generated at ${destFile}")
        }
    }

    void generateEvents(GrailsDomainClass domainClass, Writer out) {
        def templateText = getTemplateText("Events.groovy")
        def binding = [className: domainClass.shortName]
        def t = engine.createTemplate(templateText)
        t.make(binding).writeTo(out)
    }

    void generateIndex(String destDir, domainClass) {
        Assert.hasText destDir, "Argument [destDir] not specified"
        def destFile = new File("$destDir/web-app/index.html")
        destFile.withWriter { w ->
            generateIndex(w, domainClass)
        }
        LOG.info("Events generated at ${destFile}")
    }

    void generateIndex(Writer out, domainClass) {
        def templateText = getTemplateText("global-index.html")
        def project = this.grailsApplication.metadata['app.name']
        def className = []
        grailsApplication.controllerClasses.each{
            className << it.name
        }
        if (!className.contains(domainClass.name)) {
            className << domainClass.name
        }
        def binding = [className: className,
                       project: project]
        def t = engine.createTemplate(templateText)
        t.make(binding).writeTo(out)
    }

    @Override
    void generateController(GrailsDomainClass domainClass, Writer out) {
        def templateText = getTemplateText("Controller.groovy")
        boolean hasHibernate =pluginManager?.hasGrailsPlugin('hibernate')
        def oneToManyProps = domainClass.properties.findAll { it.isOneToMany() }
        def geoProps = [:]
        def listProps = domainClass.properties.findAll {Collection.isAssignableFrom(it.type)}
        Closure resourceClosure = domainClass.getStaticPropertyValue('mapping', Closure)
        if (resourceClosure) {
            def myMap = [:]
            def populator = new grails.util.ClosureToMapPopulator(myMap)
            populator.populate resourceClosure
            geoProps = myMap.findAll { listProps*.name.contains(it?.key) && it?.value?.geoIndex}
        }
        def latitude = domainClass.properties.find { it.name == "latitude" }
        def longitude = domainClass.properties.find { it.name == "longitude" }
        boolean geolocated = (latitude && longitude) || geoProps.size() > 0
        def geoProperty = null
        if (geoProps.size() > 0) {
            geoProperty = geoProps.iterator().next().key
        }

        def binding = [pluginManager: pluginManager,
                domainClass: domainClass,
                className: domainClass.shortName,
                oneToManyProps: oneToManyProps,
                propertyName: getPropertyName(domainClass),
                geolocated: geolocated,
                geoProperty : geoProperty,
                comparator: hasHibernate ? DomainClassPropertyComparator : SimpleDomainClassPropertyComparator]
        def t = engine.createTemplate(templateText)
        t.make(binding).writeTo(out)
    }

    @Override
    void generateViews(GrailsDomainClass domainClass, String destdir) {
        Assert.hasText destdir, 'Argument [destdir] not specified'
        for (t in getTemplateNames()) {
            generateView domainClass, t, new File(destdir).absolutePath
        }
    }

    void copyGrailsMobileFrameworkIfNotPresent(String base) {
        def source = "$base/src/templates/scaffolding/"
        def destination = "$base/web-app/"
        def ant = new AntBuilder();
        ant.copy(todir:destination + "js/" ) {
            fileset(dir: source + "js/")
        }
        ant.copy(todir:destination + "css/" ) {
            fileset(dir: source + "css/" )
        }
        ant.copy(todir:destination + "images/") {
            fileset(dir: source + "images/")
        }
    }

    @Override
    void generateView(GrailsDomainClass domainClass, String templateViewName, Writer out) {
        def templateText = getTemplateText(templateViewName)
        if (templateText) {
            def t = engine.createTemplate(templateText)
            def project = this.grailsApplication.metadata['app.name']

            def excludedProps = Event.allEvents.toList() << 'id' << 'version' << 'longitude' << 'latitude'
            def allowedNames = domainClass.persistentProperties*.name << 'dateCreated' << 'lastUpdated'

            def props = domainClass.properties.findAll { allowedNames.contains(it.name) && !excludedProps.contains(it.name) && it.type != null && !Collection.isAssignableFrom(it.type) }

            if (props.size() == domainClass.constrainedProperties.size()) {
                props = modifyOrderBasedOnConstraints(props, domainClass.constrainedProperties)
            }
            def listProps = domainClass.properties.findAll {Collection.isAssignableFrom(it.type)}
            def oneToOneProps = props.findAll { it.isOneToOne() || it.isEmbedded()}
            Map validationMap = getValidation(domainClass.constrainedProperties);
            def oneToManyProps = domainClass.properties.findAll { it.isOneToMany() }
            def latitude = domainClass.properties.find { it.name == "latitude" }
            def longitude = domainClass.properties.find { it.name == "longitude" }

            Closure resourceClosure = domainClass.getStaticPropertyValue('mapping', Closure)
            def geoProps = [:]
            if (resourceClosure) {
                def myMap = [:]
                def populator = new grails.util.ClosureToMapPopulator(myMap)
                populator.populate resourceClosure

                geoProps = myMap.findAll { listProps*.name.contains(it?.key) && it?.value?.geoIndex}
            }
            def geoProperty = null
            boolean geolocated = (latitude && longitude) || geoProps.size() > 0
            if (geoProps.size() > 0) {
                geoProperty = geoProps.iterator().next().key
            }
            def binding = [pluginManager: pluginManager,
                    project: project,
                    domainClass: domainClass,
                    props: props,
                    oneToOneProps: oneToOneProps,
                    oneToManyProps: oneToManyProps,
                    geolocated: geolocated,
                    geoProperty: geoProperty,
                    validationMap: validationMap,
                    className: domainClass.shortName,
                    grailsApp : grailsApplication]

            t.make(binding).writeTo(out)
        }
    }

    Map getValidation(Map map) {
        def validationMap = [:]
        map.each{ key, value ->
            String validation = "validate["
            if (!value.blank || !value.nullable) {
                if(value.propertyType != ([] as Byte[]).class && value.propertyType != ([] as byte[]).class) {
                    validation += "required,"
                }
            }
            if (!value.isNotValidStringType() && value.creditCard) {
                validation += "creditCard,"
            }
            if (!value.isNotValidStringType() && value.email) {
                validation += "custom[email],"
            }
            if (value.inList != null) {
            }
            if (!value.isNotValidStringType() && value.matches) {
            }
            if (value.max) {
                validation += "max,"
            }
            if (value.maxSize) {
                validation += "maxSize,"
            }
            if (value.min) {
                validation += "min,"
            }
            if (value.minSize) {
                validation += "minSize,"
            }
            if (value.notEqual) {
            }
            if (value.range) {
            }
            if (value.scale) {
            }
            if (value.size) {
            }
            if (!value.isNotValidStringType() && value.url) {
                validation += "custom[url],"
            }
            if (validation.endsWith(",")) {
                validation = validation.substring(0, validation.length()-1)
                validation += "]"
                validationMap[key] = validation
            }
        }
        return validationMap
//        display
//        editable
//        format
//        password
//        widget
    }

    List modifyOrderBasedOnConstraints(List props, Map constraints) {

        def sorted = []
        constraints.each { k, v ->
           props.each {
               if (it.name == k) {
                   sorted << it
               }
           }
        }
        return sorted
    }

    @Override
    void generateView(GrailsDomainClass domainClass, String templateViewName, String destDir) {
        def suffix = templateViewName.find(/\.\w+$/)
        def project = this.grailsApplication.metadata['app.name'].toLowerCase()
        def viewsDir
        def destFile
        if (suffix == '.html') {
            viewsDir = new File("$destDir/web-app")
        } else if (suffix == '.js') {
            if (templateViewName.startsWith("view")) {
                viewsDir = new File("$destDir/web-app/js/" + project + "/view")
            } else if (templateViewName != "configuration-bootstrap.js" && templateViewName != "manager-bootstrap.js"){
                viewsDir = new File("$destDir/web-app/js/" + project + "/bootstrap")
            } else {
                viewsDir = new File("$destDir/web-app/js/" + project)
            }
            copyGrailsMobileFrameworkIfNotPresent(destDir)
        } else if (suffix == '.xml') {
            viewsDir = new File("$destDir/web-app")
        }

        if (!viewsDir.exists()) viewsDir.mkdirs()

        if (suffix == '.html') { // for html files
            if (templateViewName == "global-index.html") {
                return
            } else {
                if (viewName) { // either 2nd paramater of hGV command
                    destFile = new File(viewsDir, viewName)
                } else if (domainClass.name == grailsApplication.config?.grails?.scaffolding?.html?.mobile?.index) { // or configured in Config
                    destFile = new File(viewsDir, "${templateViewName.toLowerCase()}")
                } else { //by default by convention className-index.html
                    destFile = new File(viewsDir, "${domainClass.propertyName.toLowerCase()}-${templateViewName.toLowerCase()}")
                }
            }
        } else if(suffix == '.xml') {
            destFile = new File(viewsDir, "${templateViewName.toLowerCase()}")
        }else { // for js
            if (templateViewName != "configuration-bootstrap.js" && templateViewName != "manager-bootstrap.js") {
                destFile = new File(viewsDir, "${domainClass.propertyName.toLowerCase()}-${templateViewName.toLowerCase()}")
            } else {
                destFile = new File(viewsDir, templateViewName)
            }
        }
        destFile.withWriter { Writer writer ->
            generateView domainClass, templateViewName, writer
        }
    }

    @Override
    def getTemplateNames() {
        def resources = []
        def resolver = new PathMatchingResourcePatternResolver()
        def templatesDirPath = "${basedir}/src/templates/scaffolding"
        def templatesDir = new FileSystemResource(templatesDirPath)
        if (templatesDir.exists()) {
            try {
                resources.addAll(resolver.getResources("file:$templatesDirPath/*.html").filename)
                resources.addAll(resolver.getResources("file:$templatesDirPath/*.js").filename)
                resources.addAll(resolver.getResources("file:$templatesDirPath/*.xml").filename)
            } catch (e) {
                event 'StatusError', ['Error while loading views from grails-app scaffolding folder', e]
            }
        }
        resources
    }

    private String getPropertyName(GrailsDomainClass domainClass) { "${domainClass.propertyName}${domainSuffix}" }

}
