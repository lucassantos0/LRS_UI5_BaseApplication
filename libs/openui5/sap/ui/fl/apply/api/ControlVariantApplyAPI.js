/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/fl/ControlPersonalizationAPI","sap/ui/fl/Utils"],function(L,O,U){"use strict";var C={clearVariantParameterInURL:function(p){O.clearVariantParameterInURL(p.control);},activateVariant:function(p){return O.activateVariant(p.element,p.variantReference);},attachVariantApplied:function(p){var c=p.selector.id&&sap.ui.getCore().byId(p.selector.id)||p.selector;var a=U.getAppComponentForControl(c);var v=a.getModel(U.VARIANT_MODEL_NAME);v.attachVariantApplied({vmControlId:p.vmControlId,control:c,callback:p.callback,callAfterInitialVariant:p.callAfterInitialVariant});},detachVariantApplied:function(p){var c=p.selector.id&&sap.ui.getCore().byId(p.selector.id)||p.selector;var a=U.getAppComponentForControl(c);var v=a.getModel(U.VARIANT_MODEL_NAME);v.detachVariantApplied(p.vmControlId,c.getId());}};return C;},true);
