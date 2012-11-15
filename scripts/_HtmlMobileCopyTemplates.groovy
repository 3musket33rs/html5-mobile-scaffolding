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

includeTargets << grailsScript("_GrailsInit")

target(htmlMobileCopyTemplates: "generate HTML5 mobile view with different section for CRUD") {
  depends checkVersion, parseArguments

    def targetPaths = [html: "$basedir/src/templates/scaffolding", groovy: "$basedir/src/templates/scaffolding", xml:"$basedir/src/templates/scaffolding"]

    def overwrite = false
  
    if (targetPaths.any { new File(it.value).exists() }) {
      if (!isInteractive || confirmInput('Overwrite existing templates?', 'overwrite.templates')) {
        overwrite = true
      }
    }

    targetPaths.each { sourcePath, targetDir ->
    def sourceDir = "$html5MobileScaffoldingPluginDir/src/templates/scaffolding/$sourcePath"

      ant.mkdir dir: targetDir
      ant.copy(todir: targetDir, overwrite: overwrite) {
        fileset dir: sourceDir
      }

    }

    def source = "$html5MobileScaffoldingPluginDir/src/templates/scaffolding/"
    def destination = "$basedir/src/templates/scaffolding/"



    ant.mkdir dir: destination + "js-scaffolding"
    ant.copy( todir:destination , overwrite: overwrite) {
        fileset( dir: source + "js-scaffolding/")
    }

    ant.mkdir dir: destination + "js"
    ant.copy( todir:destination + "js/" , overwrite: overwrite) {
        fileset( dir: source + "js/" )
    }

    ant.mkdir dir: destination + "css"
    ant.copy( todir:destination + "css/" , overwrite: overwrite) {
        fileset( dir: source + "css/" )
    }

    event "StatusUpdate", ["html-mobile-templates installed successfully"]

}


