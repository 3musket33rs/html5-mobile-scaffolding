includeTargets << new File("${htmlMobileScaffoldingPluginDir}/scripts/_GenerateHtmlMobileArtefacts.groovy")
includeTargets << new File("${htmlMobileScaffoldingPluginDir}/scripts/_InstallHtmlMobileTemplates.groovy")

target(default: 'Generates HTML5 Mobile views for a specified domain class') {
	depends checkVersion, parseArguments, packageApp, htmlMobileCopyTemplates

	promptForName type: 'Domain Class'
	generateForName = argsMap.params[0]

	generateForOne()
}
