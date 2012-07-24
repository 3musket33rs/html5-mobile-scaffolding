import org.grails.html.mobile.JavascriptDateRegistrar

class Html5MobileScaffoldingGrailsPlugin {

    def version = '0.1-SNAPSHOT'
    def grailsVersion = '2.0 > *'
    def dependsOn = [:]
    def pluginExcludes = []

    def title = 'Html5 Mobile Scaffolding Plugin'
    def author = '3.musket33rs'
    def authorEmail = 'th33musk3t33rs@gmail.com'
    def organization = [name: '3.musket33rs', url: 'http://3musket33rs.github.com/']
    def developers = [
      [ name: "Aramis alias Sebastien Blanc", email: "scm.blanc@gmail.com"],
      [ name: "Athos alias Corinne Krych", email: "corinnekrych@gmail.com" ],
      [ name: "Porthos alias Fabrice Matrat", email: "fabricematrat@gmail.com" ]
    ]

    def description = '''
A plugin that scaffold HTML5 mobile application using JQuery mobile in one-page. No GSP anymore.
'''

    def documentation = 'http://3musket33rs.github.com/html5-mobile-scaffolding/'
    def license = 'MIT'
    def issueManagement = [system: 'GitHub', url: 'https://github.com/3musket33rs/html5-mobile-scaffolding/issues']
    def scm = [url: 'https://github.com/3musket33rs/html5-mobile-scaffolding']
    
    
    def doWithSpring = {
      customPropertyEditorRegistrar(JavascriptDateRegistrar)
  }
}
