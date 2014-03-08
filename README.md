html5-mobile-scaffolding
========================

HTML5-mobile-scaffolding is part of the 3musket33rs mobile suite. We offer Grails plugins around mobile. You want to:

- to scaffold CRUD for a mobile first application? Header, footer, list with responsive UI powered by jQuery mobile... 
You can do it in minutes with html-generate-all command. No more GSP, you will work in single page mode with HTML5 and JavaScript.
- to geolocate your position. Easy use convention, add **latitude** and **longitude** attribute to you doamain class.
- geolocate with mongoDB plugin (3musket33rs plugin integrates well)
- use Google Maps to add markers, move markers, we wrapped Google Map services for you
- offline mode and synchronization
- push notification using [event-push plugin](http://grails.org/plugin/events-push). We use GETfull API, minimizing server side calls. No need to fetch data from server. Get notified.
- want to package in hybrid. Easy use [3musket33rs phone gap build plugin](https://github.com/3musket33rs/phonegapbuild)

You want to know more... [Find full documentation here](http://3musket33rs.github.com/html5-mobile-scaffolding/)

Install it
===========

Add a dependency to BuildConfig.groovy:

    plugins {
        compile ":html5-mobile-scaffolding:0.6.1"
        ...
    }


**NOTES:**
Not yet published on Grails central, the latest source code has been updated for Grails 2.3.6.

html5-mobile-scaffolding depends on events-push. As the only deployed version in grails central is 1.0.M3, you need to get the latest one from [github repo](https://github.com/smaldini/grails-events-push) and change BuildConfig to point to source code

	grails.plugin.location."events-push" = "../grails-events-push"

To test it
===========

	grails html-generate-all org.myproject.MyDomainClass
	grails run-app

Available Targets
=================

	html-generate-views [domainClass] [optional viewName]
	html-generate-controllers [domainClass]
	html-generate-all [domainClass] [optional viewName]

Give it a trial and send us feedback!
====================================

3muskete33rs on twitter @3musket33rs 
- Athos is Corinne Krych (@corinnekrych)
- Aramis is Sebastien Blanc (@sebi2706)
- Porthos is Fabrice Matrat (@fabricematrat)
- D'Artagnan is Mathieu Bruyen (@mathbruyen)
