grails.servlet.version = "2.5" // Change depending on target container compliance (2.5 or 3.0)
grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"
grails.project.target.level = 1.6
grails.project.source.level = 1.6
grails.tomcat.nio=true

grails.project.dependency.resolution = {
    // inherit Grails' default dependencies
    inherits("global") {
    }
    log "error" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
    checksums true // Whether to verify checksums on resolve

    repositories {
        inherits false // Whether to inherit repository definitions from plugins
        grailsPlugins()
        grailsHome()
        grailsCentral()
        mavenCentral()
        //mavenRepo "https://oss.sonatype.org/content/repositories/snapshots"
    }
    dependencies {
        compile('org.atmosphere:atmosphere-runtime:1.1.0.beta3') {
            excludes 'slf4j-api', 'atmosphere-ping'
        }
    }

    plugins {
        runtime ":jquery:1.9.1", ":cors:1.0.3"
//        runtime ":events-si:1.0.M7"
        compile ":events-push:1.0.M7"
    }
}
