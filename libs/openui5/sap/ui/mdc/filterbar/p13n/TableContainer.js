/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/mdc/filterbar/IFilterContainer','sap/m/Table','sap/m/Column','sap/m/Text'],function(I,T,C,a){"use strict";var b=I.extend("sap.ui.mdc.filterbar.p13n.TableContainer");b.prototype.init=function(){I.prototype.init.apply(this,arguments);var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");this.oLayout=new T({sticky:["ColumnHeaders"],growing:true,columns:[new C({header:new a({text:r.getText("filter.AdaptationFilterBar_FIELD_COLUMN")})}),new C({header:new a({text:r.getText("filter.AdaptationFilterBar_FIELD_VALUE_COLUMN")})})]});};b.prototype.insertFilterField=function(c,i){this.oLayout.insertItem(c,i);};b.prototype.removeFilterField=function(c){this.oLayout.removeItem(c);};b.prototype.getFilterFields=function(){return this.oLayout.getItems();};return b;});
