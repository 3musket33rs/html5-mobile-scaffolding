includeTargets << grailsScript("_GrailsInit")

target(htmlMobileCopyTemplates: "generate HTML5 mobile view with different section for CRUD") {
  depends checkVersion, parseArguments
  
  def tagetPaths = [js: "$basedir/src/templates/scaffolding", html: "$basedir/src/templates/scaffolding", groovy: "$basedir/src/templates/scaffolding"]

  def overwrite = false
  
  if (tagetPaths.any { new File(it.value).exists() }) {
    if (!isInteractive || confirmInput('Overwrite existing templates?', 'overwrite.templates')) {
      overwrite = true
    }
  }

  tagetPaths.each { sourcePath, targetDir ->
    def sourceDir = "$html5MobileScaffoldingPluginDir/src/templates/scaffolding/$sourcePath"

    ant.mkdir dir: targetDir
    ant.copy(todir: targetDir, overwrite: overwrite) {
      fileset dir: sourceDir
    }

  }

}

