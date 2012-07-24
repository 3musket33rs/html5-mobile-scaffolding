<%=packageName ? "package ${packageName}\n\n" : ''%>
<% classNameLowerCase = className.toLowerCase() %>
import grails.converters.JSON
import grails.validation.ValidationErrors
import groovy.json.JsonBuilder;

import org.codehaus.groovy.grails.web.json.JSONObject;
import org.springframework.dao.DataIntegrityViolationException

class ${className}Controller {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index() {
        redirect(action: "list", params: params)
    }
	
    def list() {

     	render ${className}.list(params) as JSON
		 
        //params.max = Math.min(params.max ? params.int('max') : 10, 100)
        //[${classNameLowerCase}InstanceList: ${className}.list(params), ${classNameLowerCase}InstanceTotal: ${className}.count()]
    }

    def create() {
       [${classNameLowerCase}Instance: new ${className}(params)]
    }

    def save() {
      def jsonObject = JSON.parse(params.${classNameLowerCase})
      ${className} ${classNameLowerCase}Instance = new ${className}(jsonObject)
        if (!${classNameLowerCase}Instance.save(flush: true)) {
//            render(view: "create", model: [${classNameLowerCase}Instance: ${classNameLowerCase}Instance])
            return
        }
      render ${classNameLowerCase}Instance as JSON
//        def ${classNameLowerCase}Instance = new ${className}(params)
//        if (!${classNameLowerCase}Instance.save(flush: true)) {
//            render(view: "create", model: [${classNameLowerCase}Instance: ${classNameLowerCase}Instance])
//            return
//        }
//
//		flash.message = message(code: 'default.created.message', args: [message(code: '${classNameLowerCase}.label', default: '${className}'), ${classNameLowerCase}Instance.id])
//        redirect(action: "show", id: ${classNameLowerCase}Instance.id)
    }

    def show() {
		render ${className}.get(params.id) as JSON
//        def ${classNameLowerCase}Instance = ${className}.get(params.id)
//        if (!${classNameLowerCase}Instance) {
//			flash.message = message(code: 'default.not.found.message', args: [message(code: '${classNameLowerCase}.label', default: '${className}'), params.id])
//            redirect(action: "list")
//            return
//        }
//
//        [${classNameLowerCase}Instance: ${classNameLowerCase}Instance]
    }

    def edit() {
        def ${classNameLowerCase}Instance = ${className}.get(params.id)
        if (!${classNameLowerCase}Instance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: '${classNameLowerCase}.label', default: '${className}'), params.id])
            redirect(action: "list")
            return
        }

        [${classNameLowerCase}Instance: ${classNameLowerCase}Instance]
    }

    def update() {
      def jsonObject = JSON.parse(params.${classNameLowerCase})
      ${className} ${classNameLowerCase}Received = new ${className}(jsonObject)

        def ${classNameLowerCase}Instance = ${className}.get(jsonObject.id)
        if (!${classNameLowerCase}Instance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: '${classNameLowerCase}.label', default: '${className}'), params.id])
            redirect(action: "list")
            return
        }

        if (jsonObject.version) {
          def version = jsonObject.version.toLong()
          if (${classNameLowerCase}Instance.version > version) {
            ${classNameLowerCase}Instance.errors.rejectValue("version", "default.optimistic.locking.failure",
                          [message(code: '${classNameLowerCase}.label', default: '${className}')] as Object[],
                          "Another user has updated this ${className} while you were editing")
                //render(view: "edit", model: [${classNameLowerCase}Instance: ${classNameLowerCase}Instance])
                ValidationErrors validationErrors = ${classNameLowerCase}Instance.errors
                render validationErrors as JSON
                return
            }
        }

        ${classNameLowerCase}Instance.properties = ${classNameLowerCase}Received.properties

        if (!${classNameLowerCase}Instance.save(flush: true)) {
            //render(view: "edit", model: [${classNameLowerCase}Instance: ${classNameLowerCase}Instance])
            return
        }

		    render ${classNameLowerCase}Instance as JSON
    }

    def delete() {
      println "in the inputs" + params
      def ${classNameLowerCase}Id = params.id
        def ${classNameLowerCase}Instance = ${className}.get(params.id)
        if (!${classNameLowerCase}Instance) {
//			flash.message = message(code: 'default.not.found.message', args: [message(code: '${classNameLowerCase}.label', default: '${className}'), params.id])
//            redirect(action: "list")
            
        }

        try {
            ${classNameLowerCase}Instance.delete(flush: true)
//			flash.message = message(code: 'default.deleted.message', args: [message(code: '${classNameLowerCase}.label', default: '${className}'), params.id])
//            redirect(action: "list")
        }
        catch (DataIntegrityViolationException e) {
//			flash.message = message(code: 'default.not.deleted.message', args: [message(code: '${classNameLowerCase}.label', default: '${className}'), params.id])
//            redirect(action: "show", id: params.id)
        }
        render ${classNameLowerCase}Instance as JSON
    }
}
