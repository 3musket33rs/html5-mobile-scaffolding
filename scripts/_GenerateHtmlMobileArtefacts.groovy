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
import org.codehaus.groovy.grails.validation.ConstrainedProperty


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

  //println "BEFORE"
  //def myClass = classLoader.loadClass('org.grails.html.mobile.HtmlMobileTemplateGenerator')
  //println "AFTER" + myClass
  
  def name = generateForName
  def viewName = htmlViewName
  

  name = name.indexOf('.') > 0 ? name : GrailsNameUtils.getClassNameRepresentation(name)


  def domainClass = grailsApp.getDomainClass(name)

  if (!domainClass) {
    grailsConsole.updateStatus 'Domain class not found in grails-app/domain, trying hibernate mapped classes...'
    bootstrap()
    domainClass = grailsApp.getDomainClass(name)
  }
  
  //grailsConsole.updateStatus "Generating HTML view ${viewName} for ${name}"
  
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
  
  if (generateViews) {
    event 'StatusUpdate', ["Generating views for domain class ${domainClass.fullName}"]



      templateGenerator.generateViews(domainClass, basedir)
    event 'GenerateViewsEnd', [domainClass.fullName]
  }

  if (generateController) {
    event 'StatusUpdate', ["Generating controller for domain class ${domainClass.fullName}"]
    templateGenerator.generateController(domainClass, basedir)
    event 'GenerateControllerEnd', [domainClass.fullName]
  }
}

class HtmlMobileTemplateGenerator extends DefaultGrailsTemplateGenerator {

 def event
 def viewName
 
 HtmlMobileTemplateGenerator(ClassLoader classLoader, String viewName) {
   super(classLoader)
   this.viewName = viewName
 }

@Override
void generateController(GrailsDomainClass domainClass, Writer out) {
        def templateText = getTemplateText("Controller.groovy")

        boolean hasHibernate =pluginManager?.hasGrailsPlugin('hibernate')

        def oneToManyProps = domainClass.properties.findAll { it.isOneToMany() }

        def binding = [pluginManager: pluginManager,
                packageName: domainClass.packageName,
                domainClass: domainClass,
                className: domainClass.shortName,
                oneToManyProps: oneToManyProps,
                propertyName: getPropertyName(domainClass),
                comparator: hasHibernate ? DomainClassPropertyComparator : SimpleDomainClassPropertyComparator]

        def t = engine.createTemplate(templateText)
        t.make(binding).writeTo(out)
}

 @Override
 void generateViews(GrailsDomainClass domainClass, String destdir) {
   Assert.hasText destdir, 'Argument [destdir] not specified'

   for (t in getTemplateNames()) {
     //event 'StatusUpdate', ["Generating $t for domain class ${domainClass.fullName}"]
     println ":::::::::::TemplateNAme ${t}"
     generateView domainClass, t, new File(destdir).absolutePath
   }
 }

 void copyGrailsMobileFrameworkIfNotPresent(String base) {
     def source = "$base/src/templates/scaffolding/"
     def destination = "$base/web-app/"
     def ant = new AntBuilder();
     ant.copy( todir:destination + "js/" ) {
         fileset( dir: source + "js/")
     }
     ant.copy( todir:destination + "css/" ) {
         fileset( dir: source + "css/" )
     }
 }

 @Override
 void generateView(GrailsDomainClass domainClass, String templateViewName, Writer out) {
   def templateText = getTemplateText(templateViewName)
   if (templateText) {

     def t = engine.createTemplate(templateText)
     def multiPart = domainClass.properties.find {it.type == ([] as Byte[]).class || it.type == ([] as byte[]).class}

     boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate')
     def packageName = domainClass.packageName
     def project = this.grailsApplication.metadata['app.name']
     
     def excludedProps = Event.allEvents.toList() << 'id' << 'version' << 'longitude' << 'latitude'
     def allowedNames = domainClass.persistentProperties*.name << 'dateCreated' << 'lastUpdated'
     def props = domainClass.properties.findAll { allowedNames.contains(it.name) && !excludedProps.contains(it.name) && it.type != null && !Collection.isAssignableFrom(it.type) }
     
     def listProps = domainClass.properties.findAll {Collection.isAssignableFrom(it.type)}
     
     def oneToOneProps = props.findAll { it.isOneToOne() }

     println "-------- " + oneToOneProps + " --------"

     String validation = getValidation(domainClass.constrainedProperties);

     def oneToManyProps = domainClass.properties.findAll { it.isOneToMany() }

     println "-------- " + oneToManyProps + " --------"
     //println "------------- oneToMany: " + oneToManyProps*.getReferencedDomainClass().get(0).getName()
     //def oneToManyProps2 = []
     //oneToManyProps2 << oneToManyProps*.getReferencedDomainClass().get(0).getName()
     def latitude = domainClass.properties.find { it.name == "latitude" }
     def longitude = domainClass.properties.find { it.name == "longitude" }
     
     boolean geolocated = latitude && longitude
    
     Closure resourceClosure = domainClass.getStaticPropertyValue('mapping', Closure)
     def geoProps = [:]
     if (resourceClosure) {
       def myMap = [:]
       def populator = new grails.util.ClosureToMapPopulator(myMap)
       populator.populate resourceClosure
       
       geoProps = myMap.findAll { listProps*.name.contains(it?.key) && it?.value?.geoIndex}
     }
     def binding = [pluginManager: pluginManager,
       project: project,
       packageName: packageName,
       domainClass: domainClass,
       props: props,
       oneToOneProps: oneToOneProps,
       oneToManyProps: oneToManyProps,
       geolocated: geolocated,
       geoProps:geoProps,
       validation: validation,
       className: domainClass.shortName,
       grailsApp : grailsApplication]

     t.make(binding).writeTo(out)
   }
 }


    String getValidation(Map map) {
        String validation = "validate["

        map.each{ k,v ->
            ConstrainedProperty cp = (ConstrainedProperty)v

            if (!cp.blank || !cp.nullable) {
                validation += "required,"
            } else if (!cp.isNotValidStringType() && cp.creditCard) {
                validation += "creditCard,"
            } else if (!cp.isNotValidStringType() && cp.email) {
                validation += "custom[email],"
            } else if (cp.inList != null) {
            } else if (!cp.isNotValidStringType() && cp.matches) {
            } else if (cp.max) {
            } else if (cp.maxSize) {
            } else if (cp.min) {
            } else if (cp.minSize) {
            } else if (cp.notEqual) {
            } else if (cp.range) {
            } else if (cp.scale) {
            } else if (cp.size) {
            } else if (!cp.isNotValidStringType() && cp.url) {
                validation += "custom[url],"
            }
        }
        if (validation.endsWith(",")) {
            validation = validation.substring(0, validation.length()-1)
            validation += "]"
        } else {
            return ""
        }
        return validation

//        if (key=="blank") {
//            value.key
//        } else if (key == "creditCard") {
//        } else if (key == "email") {
//        } else if (key == "inList") {
//        } else if (key == "matches") {
//        } else if (key == "max") {
//        } else if (key == "maxSize") {
//        } else if (key == "min") {
//        } else if (key == "minSize") {
//        } else if (key == "notEqual") {
//        } else if (key == "nullable") {
//        } else if (key == "range") {
//            value.range
//        } else if (key == "scale") {
//        } else if (key == "size") {
//        } else if (key == "unique") {
//        } else if (key == "url") {
//        } else if (key == "validator") {
//        }

//        display
//        editable
//        format
//        password
//        widget
    }

    @Override
 void generateView(GrailsDomainClass domainClass, String templateViewName, String destDir) {
     println "------------- generate view start " + templateViewName + domainClass.packageName
   def suffix = templateViewName.find(/\.\w+$/)

   def viewsDir
   def destFile
   if (suffix == '.html') {
     viewsDir = new File("$destDir/web-app")
   } else if (suffix == '.js') {
       if (templateViewName.startsWith("view")) {
         viewsDir = new File("$destDir/web-app/js/" + domainClass.packageName + "/view")
       } else if (templateViewName != "configuration-bootstrap.js" && templateViewName != "manager-bootstrap.js"){
           println "bootstrap $templateViewName"
           viewsDir = new File("$destDir/web-app/js/" + domainClass.packageName + "/bootstrap")
       } else {
           viewsDir = new File("$destDir/web-app/js/" + domainClass.packageName)
       }
       copyGrailsMobileFrameworkIfNotPresent(destDir)
   } else if (suffix == '.xml') {
       println ":::::::::::::::::::::::::: config.xml"
       viewsDir = new File("$destDir/web-app")
   }

     if (!viewsDir.exists()) viewsDir.mkdirs()
  
   if (suffix == '.html') { // for html files

     if (templateViewName == "global-index.html") {
         destFile = new File(viewsDir, "index.html")
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
