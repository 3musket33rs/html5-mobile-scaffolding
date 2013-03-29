html5-mobile-scaffolding
========================

HTML5-mobile-scaffolding is part of the 3muket33rs mobile suite. We offer Grails plugin around mobile. You want to:


- to scaffold CRUD for a mobile first application? Header, footer, list with responsive UI powered by jQuery mobile... 
You can do it in minutes with html-generate-all command. No more GSP, you will work in single page mode with HTML5 and JavaScript.
- to geolocate your position. Easy use convention, add **latitude** and **longitude** attribute to you doamain class.
- geolocate with mongoDB we integrate with
- use Google Maps to add markers, move markers, we wrapped Google Map services for you
- offline mode and synchronization
- push notification using [event-push plugin](http://grails.org/plugin/events-push). We use GETfull API, minimizing server side calls. No need to fetch data from server. Get notified.
- want to package in hybrid. Easy use [3musket33rs phone gap build plugin](https://github.com/3musket33rs/phonegapbuild)

[Find full documentation here](http://3musket33rs.github.com/html5-mobile-scaffolding/)

Install it
===========

Add a dependency to BuildConfig.groovy:

    plugins {
        compile ":html-mobile-scafolding:0.4.4"
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

Give it a trial and send us feedback!

3mukete33rs on twitter @3muket33rs 
- Athos is Corinne Krych (@corinnekrych)
- Aramis is Sebastien Blanc (@sebi2706)
- Porthos is Fabrice Matrat (@fabricematrat)
- D'artagnain is Mathieu Bruyen (@mathbruyen)
