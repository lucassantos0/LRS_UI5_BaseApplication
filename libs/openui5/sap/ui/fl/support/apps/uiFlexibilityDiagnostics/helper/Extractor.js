/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/util/File","sap/ui/core/util/reflection/JsControlTreeModifier","sap/m/MessageBox","sap/ui/thirdparty/jquery"],function(F,J,M,q){"use strict";var E={};E.VERSION='v1.0';E.extractData=function(c){var e={sVersion:E.VERSION,bIsInvestigationExport:true,mControlData:{},aAppliedChanges:[],aFailedChanges:[],aNotApplicableChanges:[],mChangesEntries:{},mVariantsChanges:{},sComponentName:c._mComponent.name};this._enhanceExportWithChangeData(c,e);this._enhanceExportWithVariantChangeData(c,e);this._enhanceExportWithControlData(c,e);return e;};E.getAppComponentInstance=function(c){var C;var a=q.find(".sapUiComponentContainer");a.some(function(o){var b=sap.ui.getCore().byId(o.id);var A=b&&b.getComponentInstance();if(A&&A.getMetadata().getName()===c){C=A;return true;}});return C;};E._enhanceExportWithChangeData=function(c,e){var a=E.getAppComponentInstance(e.sComponentName);q.each(c._mChangesEntries,function(C,o){e.mChangesEntries[C]={mDefinition:o._oDefinition,aControlsDependencies:[],aDependencies:[]};if(o._aDependentSelectorList){o._aDependentSelectorList.forEach(function(s){var m={bPresent:!!J.bySelector(s,a),aAppliedChanges:[],aFailedChangesJs:[],aFailedChangesXml:[],aNotApplicableChanges:[]};e.mControlData[s.id]=m;});}});this._enhanceExportWithDependencyData(c,e);};E._enhanceExportWithDependencyData=function(c,e){q.each(c._mChangesInitial.mDependencies,function(C,m){e.mChangesEntries[C].aControlsDependencies=m.controlsDependencies;e.mChangesEntries[C].aDependencies=m.dependencies;});};E._enhanceExportWithVariantChangeData=function(c,e){q.each(c._mVariantsChanges,function(C,o){e.mVariantsChanges[C]={mDefinition:o._oDefinition};});};E._enhanceWithChangetypeSpecificData=function(e,s,c,C,a){if(a){c[C]=a;c[C].map(function(b){if(!(b in e[s])){e[s].push(b);}});}};E._getChangesForControlFromCustomData=function(c,i){var C=c.getCustomData();var a=[];C.forEach(function(o){var k=o.getKey();if(k.startsWith(i)){a.push(k.replace(i,""));}});return a;};E._enhanceExportWithControlData=function(c,e){q.each(c._mChanges.mChanges,function(C){var m={bPresent:false,aAppliedChanges:[],aFailedChangesJs:[],aFailedChangesXml:[],aNotApplicableChanges:[]};var o=sap.ui.getCore().byId(C);if(o){m.bPresent=true;this._enhanceWithChangetypeSpecificData(e,"aAppliedChanges",m,"aAppliedChanges",this._getChangesForControlFromCustomData(o,"sap.ui.fl.appliedChanges."));this._enhanceWithChangetypeSpecificData(e,"aFailedChanges",m,"aFailedChangesJs",this._getChangesForControlFromCustomData(o,"sap.ui.fl.failedChanges.js."));this._enhanceWithChangetypeSpecificData(e,"aFailedChanges",m,"aFailedChangesXml",this._getChangesForControlFromCustomData(o,"sap.ui.fl.failedChanges.xml."));this._enhanceWithChangetypeSpecificData(e,"aNotApplicableChanges",m,"aNotApplicableChanges",this._getChangesForControlFromCustomData(o,"sap.ui.fl.notApplicableChanges."));}e.mControlData[C]=m;}.bind(this));};E.createDownloadFile=function(o){try{var s=JSON.stringify(o);F.save(s,"flexibilityDataExtraction","json");}catch(e){M.error("The export of the flexibility data was not successful.\n"+e.message);}};return E;});
