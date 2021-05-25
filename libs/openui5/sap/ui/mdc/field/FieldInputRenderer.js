/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer','sap/m/InputRenderer'],function(R,I){"use strict";var F=R.extend(I);F.apiVersion=2;F.addOuterClasses=function(r,i){I.addOuterClasses.apply(this,arguments);r.class("sapUiMdcFieldInput");};F.getAriaRole=function(i){var a=i.getAriaAttributes();if(a.role){return a.role;}else{return I.getAriaRole.apply(this,arguments);}};F.getAccessibilityState=function(i){var a=i.getAriaAttributes();var A=I.getAccessibilityState.apply(this,arguments);if(a.aria){for(var s in a.aria){A[s]=a.aria[s];}}return A;};F.writeInnerAttributes=function(r,i){I.writeInnerAttributes.apply(this,arguments);var a=i.getAriaAttributes();for(var A in a){if(A!=="aria"&&A!=="role"){r.attr(A,a[A]);}}};return F;});
