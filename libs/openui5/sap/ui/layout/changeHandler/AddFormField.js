/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/changeHandler/BaseAddViaDelegate"],function(B){"use strict";var A=B.createAddViaDelegateChangeHandler({addProperty:function(p){var i=p.innerControls;var m=p.modifier;var v=p.view;var a=p.appComponent;var c=p.change;var C=c.getContent();var I=C.newFieldIndex;var f=C.newFieldSelector;var o;if(!i.layoutControl){o=m.createControl("sap.ui.layout.form.FormElement",a,v,f);m.insertAggregation(o,"label",i.label,0,v);m.insertAggregation(o,"fields",i.control,0,v);}else{o=i.control;}var P=c.getDependentControl("parentFormContainer",p);m.insertAggregation(P,"formElements",o,I,v);if(i.valueHelp){m.insertAggregation(P,"dependents",i.valueHelp,0,v);}},aggregationName:"formElements",parentAlias:"parentFormContainer",fieldSuffix:"-field",supportsDefault:true});return A;},true);
