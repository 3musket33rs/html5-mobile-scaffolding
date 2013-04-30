/* Copyright 2012 the original author or authors.
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

//comment
import org.grails.html.mobile.JavascriptDateRegistrar

class Html5MobileScaffoldingGrailsPlugin {

  def version = '0.6'
  def grailsVersion = '2.0 > *'
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
  def license = 'APACHE'
  def issueManagement = [system: 'GitHub', url: 'https://github.com/3musket33rs/html5-mobile-scaffolding/issues']
  def scm = [url: 'https://github.com/3musket33rs/html5-mobile-scaffolding']

  def doWithSpring = {
    customPropertyEditorRegistrar(JavascriptDateRegistrar)
  }
}
