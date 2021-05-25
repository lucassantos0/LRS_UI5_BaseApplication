/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer','sap/m/MultiInputRenderer'],function(R,M){"use strict";var F=R.extend(M);F.apiVersion=2;F.addOuterClasses=function(r,m){M.addOuterClasses.apply(this,arguments);r.class("sapUiMdcFieldMultiInput");};F.getAriaRole=function(m){var a=m.getAriaAttributes();if(a.role){return a.role;}else{return M.getAriaRole.apply(this,arguments);}};F.getAccessibilityState=function(m){var a=m.getAriaAttributes();var A=M.getAccessibilityState.apply(this,arguments);if(a.aria){for(var s in a.aria){A[s]=a.aria[s];}}return A;};F.writeInnerAttributes=function(r,m){M.writeInnerAttributes.apply(this,arguments);var a=m.getAriaAttributes();for(var A in a){if(A!=="aria"&&A!=="role"){r.attr(A,a[A]);}}};return F;});
