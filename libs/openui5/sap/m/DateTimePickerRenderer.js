/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer','./DatePickerRenderer','./InputBaseRenderer','sap/ui/core/library'],function(R,D,I,c){"use strict";var a=R.extend(D);a.apiVersion=2;a.getDescribedByAnnouncement=function(d){var b=I.getDescribedByAnnouncement.apply(this,arguments);return sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("DATETIMEPICKER_TYPE")+" "+b;};a.getAccessibilityState=function(d){var A=D.getAccessibilityState.apply(this,arguments);A["haspopup"]=c.aria.HasPopup.Dialog.toLowerCase();return A;};return a;},true);
