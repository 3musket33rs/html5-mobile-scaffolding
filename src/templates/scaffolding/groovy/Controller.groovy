<%=domainClass.packageName ? "package ${domainClass.packageName}\n" : ''%>
<%
def uncapitalize(s) { s[0].toLowerCase() + s[1..-1]}
classNameLowerCase = uncapitalize(className)
%>

import grails.converters.JSON
import org.grails.datastore.mapping.validation.ValidationErrors
import org.springframework.dao.DataIntegrityViolationException
import org.codehaus.groovy.grails.commons.DefaultGrailsDomainClass

class ${className}Controller {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index() {
        redirect(action: "list", params: params)
    }
	
    def list() {
      params.max = Math.min(params.max ? params.int('max') : 10, 100)
      <% if(geoProperty) {%>render getElementsReady(${className}.list(params)) as JSON<% } else {
      %>render ${className}.list(params) as JSON<% } %>
    }

    def save() {
      def jsonObject = JSON.parse(params.${classNameLowerCase})
      <% if(oneToManyProps) {
        oneToManyProps.each {
          referencedType = it.getReferencedDomainClass().getName()
          referencedTypeToLowerCase = uncapitalize(referencedType)
      %>
      def ${it.name} = []
      jsonObject.${it.name}.each() {
         ${it.name} << ${referencedType}.get(it.id)
      }
      jsonObject.${it.name} = null
      <% } } %>
      ${className} ${classNameLowerCase}Instance = new ${className}(jsonObject)
      <% if(geolocated) {
      %>if (jsonObject.latitude && jsonObject.longitude) {
        <% if (geoProperty) {
        %>${classNameLowerCase}Instance.${geoProperty} = [Double.parseDouble(jsonObject.latitude), Double.parseDouble(jsonObject.longitude)]<% } else {
        %>${classNameLowerCase}Instance.longitude = Double.parseDouble(jsonObject.longitude)
        ${classNameLowerCase}Instance.latitude = Double.parseDouble(jsonObject.latitude)<% }%>
      } else {
        <% if (geoProperty) {
        %>${classNameLowerCase}Instance.errors.reject( 'default.null.message', ['${geoProperty}', 'class ${className}'] as Object[], 'Property [{0}] of class [{1}] cannot be null')
        ${classNameLowerCase}Instance.errors.rejectValue('${geoProperty}', 'default.null.message')<% } else {
        %>${classNameLowerCase}Instance.errors.reject( 'default.null.message', ['longitude,latitude', 'class ${className}'] as Object[], 'Property [{0}] of class [{1}] cannot be null')
        ${classNameLowerCase}Instance.errors.rejectValue('longitude,latitude', 'default.null.message')<% }%>
      }
      <% } %><% if(oneToManyProps) {
        oneToManyProps.each {
      %>
      ${classNameLowerCase}Instance.${it.name} = ${it.name}
      <% } } %>
      if (!${classNameLowerCase}Instance.save(flush: true)) {
        ValidationErrors validationErrors = ${classNameLowerCase}Instance.errors
        render validationErrors as JSON
        return
      }
      <% if(geoProperty) {
      %>def json = populateElement(${classNameLowerCase}Instance).encodeAsJSON()
      event topic:"save-${classNameLowerCase}", data: json
      render json<% } else { %>
      def asJson = ${classNameLowerCase}Instance as JSON
      event topic:"save-${classNameLowerCase}", data: asJson.toString()
      render ${classNameLowerCase}Instance as JSON<% } %>
    }
    
    def show() {
      def ${classNameLowerCase}Instance = ${className}.get(params.id)
      if (!${classNameLowerCase}Instance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: '${classNameLowerCase}.label', default: '${className}'), params.id])
        render flash as JSON
        return
      }
      <% if(geoProperty) {%>
      render populateElement(${classNameLowerCase}Instance).encodeAsJSON()<% } else { %>
      render ${classNameLowerCase}Instance as JSON<% } %>
    }

    def update() {
      def jsonObject = JSON.parse(params.${classNameLowerCase})

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

      ${className} ${classNameLowerCase}Received = new ${className}(jsonObject)

      new DefaultGrailsDomainClass(${className}.class).persistentProperties.each() {
          if (it.oneToOne || it.embedded) {
            ${classNameLowerCase}Instance[it.name] = it.type.get(jsonObject["\${it.name}.id"])
          } else {
            ${classNameLowerCase}Instance[it.name] = ${classNameLowerCase}Received[it.name]
          }
      }
      <% if(oneToManyProps) {
      oneToManyProps.each {
        referencedType = it.getReferencedDomainClass().getName()
        referencedTypeToLowerCase = uncapitalize(referencedType)
      %>
      ${classNameLowerCase}Instance.${it.name} = []
      jsonObject.${it.name}.each() {
        ${classNameLowerCase}Instance.${it.name} << ${referencedType}.get(it.id)
      }<% } } %><% if(geoProperty) {
      %>if (jsonObject.latitude && jsonObject.longitude) {
        ${classNameLowerCase}Instance.${geoProperty} = [Double.parseDouble(jsonObject.latitude), Double.parseDouble(jsonObject.longitude)];
      } else {
        ${classNameLowerCase}Instance.errors.reject( 'default.null.message', ['${geoProperty}', 'class ${className}'] as Object[], 'Property [{0}] of class [{1}] cannot be null')
        ${classNameLowerCase}Instance.errors.rejectValue('${geoProperty}', 'default.null.message')
      }<% } %>
      if (!${classNameLowerCase}Instance.save(flush: true)) {
        ValidationErrors validationErrors = ${classNameLowerCase}Instance.errors
        render validationErrors as JSON
        return
      }
      <% if(geoProperty) {%>
      def json = populateElement(${classNameLowerCase}Instance).encodeAsJSON()
      event topic:"update-${classNameLowerCase}", data: json
      render json<% } else { %>
      def asJson = ${classNameLowerCase}Instance as JSON
      event topic:"update-${classNameLowerCase}", data: asJson.toString()
      render ${classNameLowerCase}Instance as JSON<% } %>
    }

    def delete() {
      def ${classNameLowerCase}Instance = ${className}.get(params.id)
      <% if(oneToManyProps) {
        oneToManyProps.each {
          referencedType = it.getReferencedDomainClass().getName()
          referencedTypeToLowerCase = uncapitalize(referencedType)
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
      <% if(geoProperty) {
      %>def json = populateElement(${classNameLowerCase}Instance).encodeAsJSON()
      event topic:"delete-${classNameLowerCase}", data: json
      render json<% } else { %>
      event topic:"delete-${classNameLowerCase}", data: ${classNameLowerCase}Instance
      render ${classNameLowerCase}Instance as JSON<% } %>
    }
    <% if(geoProperty) {%>
    private List getElementsReady(List elements) {
      def list = []
      elements.each {
        populateElement(it)
        list << it.dbo as JSON
      }
      return list;
    }

    private def populateElement(def element) {
      if (element.${geoProperty} && element.${geoProperty}.size() == 2) {
        element.dbo.latitude = element.${geoProperty}[0]
        element.dbo.longitude = element.${geoProperty}[1]
      }
      element.dbo.'class' = element.class.name
      element.dbo.id = element.dbo.'_id'
      element.dbo.remove("_id")
      element.dbo.remove("location")
      return element.dbo
    }<% } %>
}
