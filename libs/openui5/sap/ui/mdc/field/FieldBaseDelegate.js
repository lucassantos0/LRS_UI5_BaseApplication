/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/mdc/BaseDelegate','sap/ui/mdc/odata/TypeUtil'],function(B,T){"use strict";var F=Object.assign({},B);F.getDataTypeClass=function(p,t){return T.getDataTypeClassName(t);};F.getBaseType=function(p,t,f,c){return T.getBaseType(t,f,c);};F.initializeTypeFromBinding=function(p,t,v){return{};};F.initializeInternalUnitType=function(p,t,o){};F.isInputValidationEnabled=function(p,f){if(f&&f.isValidationSupported()){return true;}else{return false;}};F.isInvalidInputAllowed=function(p,f){if(f){return!f.getValidateInput();}else{return true;}};F.getItemForValue=function(p,f,v,P,b,c,C,a){if(f){return f.getItemForValue(v,P,undefined,undefined,b,c,C,a);}};F.getDescription=function(p,f,k,i,o,b){if(f){return f.getTextForKey(k,i,o,b);}};F.getDefaultFieldHelpBaseDelegate=function(p){return{name:"sap/ui/mdc/field/FieldHelpBaseDelegate",payload:{}};};F.getDefaultFieldValueHelpDelegate=function(p){return{name:"sap/ui/mdc/field/FieldValueHelpDelegate",payload:{}};};F.getTypeUtil=function(p){return T;};return F;});
