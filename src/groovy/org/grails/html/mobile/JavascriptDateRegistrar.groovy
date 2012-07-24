package org.grails.html.mobile

import java.text.SimpleDateFormat

import org.springframework.beans.PropertyEditorRegistrar;
import org.springframework.beans.PropertyEditorRegistry;
import org.springframework.beans.propertyeditors.CustomDateEditor

class JavascriptDateRegistrar implements PropertyEditorRegistrar {

    public void registerCustomEditors(PropertyEditorRegistry registry) {
        registry.registerCustomEditor(Date, new CustomDateEditor(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.sss'Z'"), true))
        registry.registerCustomEditor(Date, new CustomDateEditor(new SimpleDateFormat("yyyy-MM-dd"), true))
    }

}
