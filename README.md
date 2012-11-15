html5-mobile-scaffolding
========================

A plugin that scaffolds HTML5 mobile application using jQuery mobile in a single page.


Install it
===========

Add a dependency to BuildConfig.groovy:

    plugins {
        compile ":html-:0.4.3"
        ...
    }


To test it
===========

	grails html-generate-all org.myproject.MyDomainClass
	grails run-app

Available Targets
=================

	html-generate-views [domainClass] [optional viewName]
	html-generate-controllers [domainClass]
	html-generate-all [domainClass] [optional viewName]

Refers to full documentation for details of what is generated. 

http://3musket33rs.github.com/html5-mobile-scaffolding/

Or even better give it a trial.

TO DO
=====

Because it is a a version 0.4.3, this plugin is under active development, here is the list of TO DO

* scaffold different UI component depending on contraints defined at domain level. numerical range=>slider
* finish error handling for validation issue
* implement ByteArray type(for use case of images storage)
* i18n
* add script allowing: like html-generate-all *
* write demo application with spock tests with all types, relationships etc... to demo full scaffolding
* generate unit tests scaffolding: groovy/jasmine to promote best pratices
* template generation
* gsp tag like
* introduce a MVC from market or make our own dynamic and extendable