/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/_internal/changes/Applier","sap/ui/fl/apply/_internal/changes/Reverter","sap/ui/fl/apply/_internal/ChangesController","sap/ui/fl/apply/_internal/appVariant/DescriptorChangeTypes","sap/ui/fl/write/_internal/appVariant/AppVariantInlineChangeFactory","sap/ui/fl/descriptorRelated/api/DescriptorChangeFactory","sap/base/Log","sap/ui/core/Component","sap/ui/core/Element","sap/ui/core/util/reflection/JsControlTreeModifier","sap/base/util/includes","sap/base/util/restricted/_omit"],function(A,R,C,D,a,b,L,c,E,J,i,_){"use strict";var d={create:function(p){var f;if(i(D.getChangeTypes(),p.changeSpecificData.changeType)){f=C.getDescriptorFlexControllerInstance(p.selector);var r=f.getComponentName();var l;if(p.changeSpecificData.layer){l=p.changeSpecificData.layer;delete p.changeSpecificData.layer;}var I={changeType:p.changeSpecificData.changeType,content:p.changeSpecificData.content};if(p.changeSpecificData.texts){I.texts=p.changeSpecificData.texts;}return a.createDescriptorInlineChange(I).then(function(o){return new b().createNew(r,o,l,p.selector);}).catch(function(e){L.error("the change could not be created.",e.message);throw e;});}if(p.selector.name&&p.selector.view){f=C.getFlexControllerInstance(p.selector.view);}else{f=C.getFlexControllerInstance(p.selector);}if(p.selector instanceof c){return f.createBaseChange(p.changeSpecificData,p.selector);}if(p.selector.name&&p.selector.view){return f.createChangeWithExtensionPointSelector(p.changeSpecificData,p.selector);}return f.createChangeWithControlSelector(p.changeSpecificData,p.selector);},apply:function(p){if(!p.element instanceof E){return Promise.reject("Please provide an Element");}var f=C.getFlexControllerInstance(p.element);p.appComponent=C.getAppComponentForSelector(p.element);if(!p.modifier){p.modifier=J;}return A.applyChangeOnControl(p.change,p.element,_(p,["element","change"])).then(function(r){var e=f.checkForOpenDependenciesForControl(p.change.getSelector(),p.appComponent);if(e){return d.revert({change:p.change,element:p.element}).then(function(){throw Error("The following Change cannot be applied because of a dependency: "+p.change.getId());});}return r;});},revert:function(p){var o;if(p.element instanceof E){o=C.getAppComponentForSelector(p.element);}var r={modifier:J,appComponent:o};return R.revertChangeOnControl(p.change,p.element,r);}};return d;},true);