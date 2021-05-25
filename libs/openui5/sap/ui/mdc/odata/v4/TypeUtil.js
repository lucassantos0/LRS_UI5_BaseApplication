/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/mdc/odata/TypeUtil','sap/ui/mdc/enum/BaseType'],function(O,B){"use strict";var a=Object.assign({},O);a.getBaseType=function(t,f,c){switch(t){case"sap.ui.model.odata.type.Date":return B.Date;case"sap.ui.model.odata.type.TimeOfDay":return B.Time;case"sap.ui.model.odata.type.Unit":case"sap.ui.model.odata.type.Currency":if(!f||!f.hasOwnProperty("showMeasure")||f.showMeasure){return B.Unit;}else{return B.Numeric;}break;default:return O.getBaseType(t,f,c);}};a.getDataTypeClassName=function(t){var e={"Edm.Date":"sap.ui.model.odata.type.Date","Edm.TimeOfDay":"sap.ui.model.odata.type.TimeOfDay"};if(e[t]){t=e[t];}else{t=O.getDataTypeClassName(t);}return t;};return a;},true);
