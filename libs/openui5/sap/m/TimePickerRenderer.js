/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer','./InputBaseRenderer','sap/ui/core/library'],function(R,I,c){"use strict";var T=R.extend(I);T.apiVersion=2;T.CSS_CLASS="sapMTimePicker";T.addOuterClasses=function(r,C){r.class(T.CSS_CLASS);};T.writeInnerValue=function(r,C){r.attr("value",C._formatValue(C.getDateValue()));};T.getAriaRole=function(){return"combobox";};T.getLabelledByAnnouncement=function(C){return C._getPlaceholder()||"";};T.getAccessibilityState=function(C){var a=I.getAccessibilityState.apply(this,arguments);a["roledescription"]=C._oResourceBundle.getText("ACC_CTR_TYPE_TIMEINPUT");a["autocomplete"]="none";a["haspopup"]=c.aria.HasPopup.Dialog.toLowerCase();a["expanded"]=false;a["disabled"]=null;a["owns"]=C.getId()+"-sliders";return a;};return T;},true);
