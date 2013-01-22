<%=packageName ? "package ${packageName}\n" : ''%>
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
      params.max = Math.min(params.max ? params.int('max') : 10, 100)
      render ${className}.list(params) as JSON
    }

    def save() {
      def jsonObject = JSON.parse(params.${classNameLowerCase})
      <% if(oneToManyProps) {
        oneToManyProps.each {
          referencedType = it.getReferencedDomainClass().getName()
          referencedTypeToLowerCase = referencedType.toLowerCase()
      %>
      def ${it.name} = []
      jsonObject.${it.name}.each() {
         String id = it.id
         ${referencedType} ${referencedTypeToLowerCase} = ${referencedType}.get(id)
         ${it.name}.add(${referencedTypeToLowerCase})
      }
      jsonObject.${it.name} = null
      <% } } %>
      ${className} ${classNameLowerCase}Instance = new ${className}(jsonObject)

      <% if(oneToManyProps) {
        oneToManyProps.each {
      %>
      ${classNameLowerCase}Instance.${it.name} = ${it.name}
      <% } } %>
      if (!${classNameLowerCase}Instance.save(flush: true)) {
        ValidationErrors validationErrors = ${classNameLowerCase}Instance.errors
        render validationErrors as JSON
        return
      }

      event topic:"save-${classNameLowerCase}", data: ${classNameLowerCase}Instance

      render ${classNameLowerCase}Instance as JSON
    }
    
    def show() {
      def ${classNameLowerCase}Instance = ${className}.get(params.id)
      if (!${classNameLowerCase}Instance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: '${classNameLowerCase}.label', default: '${className}'), params.id])
        render flash as JSON
        return
      }
      render ${className}Instance as JSON
    }

    def update() {
      def jsonObject = JSON.parse(params.${classNameLowerCase})
        <% if(oneToManyProps) {
          oneToManyProps.each {
            referencedType = it.getReferencedDomainClass().getName()
            referencedTypeToLowerCase = referencedType.toLowerCase()
        %>
        def ${it.name} = []
                jsonObject.${it.name}.each() {
                    String id = it.id
                    ${referencedType} ${referencedTypeToLowerCase} = ${referencedType}.get(id)
                    ${it.name}.add(${referencedTypeToLowerCase})
                }
                jsonObject.${it.name} = null
        <% } } %>
        ${className} ${classNameLowerCase}Received = new ${className}(jsonObject)
        <% if(oneToManyProps) {
          oneToManyProps.each {
        %>
        ${classNameLowerCase}Received.${it.name} = ${it.name}
        <% } } %>
        def ${classNameLowerCase}Instance = ${className}.get(jsonObject.id)
        if (!${classNameLowerCase}Instance) {
          flash.message = message(code: 'default.not.found.message', args: [message(code: '${classNameLowerCase}.label', default: '${className}'), params.id])
          render flash as JSON
          return
        }

        if (jsonObject.version) {
          def version = jsonObject.version.toLong()
          if (${classNameLowerCase}Instance.version > version) {
            ${classNameLowerCase}Instance.errors.rejectValue("version", "default.optimistic.locking.failure",
                                                             [message(code: '${classNameLowerCase}.label', default: '${className}')] as Object[],
                                                             "Another user has updated this ${className} while you were editing")
              ValidationErrors validationErrors = ${classNameLowerCase}Instance.errors
              render validationErrors as JSON
              return
          }
        }

        ${classNameLowerCase}Instance.properties = ${classNameLowerCase}Received.properties

        if (!${classNameLowerCase}Instance.save(flush: true)) {
          ValidationErrors validationErrors = ${classNameLowerCase}Instance.errors
          render validationErrors as JSON
          return
        }

        event topic:"update-${classNameLowerCase}", data: ${classNameLowerCase}Instance

        render ${classNameLowerCase}Instance as JSON
    }

    def delete() {
      def ${classNameLowerCase}Instance = ${className}.get(params.id)
      <% if(oneToManyProps) {
        oneToManyProps.each {
          referencedType = it.getReferencedDomainClass().getName()
          referencedTypeToLowerCase = referencedType.toLowerCase()
      %>
      ${classNameLowerCase}Instance.${it.name}.each() {
        ${referencedType}.get(it.getId());
      }
      <% } } %>
      if (!${classNameLowerCase}Instance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: '${classNameLowerCase}.label', default: '${className}'), params.id])
        render flash as JSON
        return
      }
      try {
        ${classNameLowerCase}Instance.delete(flush: true)
      }
      catch (DataIntegrityViolationException e) {
        flash.message = message(code: 'default.not.deleted.message', args: [message(code: '${classNameLowerCase}.label', default: '${className}'), params.id])
        render flash as JSON
        return
      }

      event topic:"delete-${classNameLowerCase}", data: ${classNameLowerCase}Instance

      render ${classNameLowerCase}Instance as JSON
    }
}
