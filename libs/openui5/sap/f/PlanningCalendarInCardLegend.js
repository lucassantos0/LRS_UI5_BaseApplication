/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/m/PlanningCalendarLegend','sap/ui/unified/CalendarLegendItem','./PlanningCalendarInCardLegendRenderer'],function(P,C,a){"use strict";var b=P.extend("sap.f.PlanningCalendarInCardLegend",{metadata:{library:"sap.m",properties:{visibleLegendItemsCount:{type:"int",group:"Data",defaultValue:2}}}});b.prototype.exit=function(){P.prototype.exit.call(this,arguments);if(this._oItemsLink){this._oItemsLink.destroy();this._oItemsLink=null;}};b.prototype._getMoreItemsText=function(i){if(!this._oItemsLink){this._oItemsLink=new sap.ui.unified.CalendarLegendItem({text:"More ("+i+")"});}return this._oItemsLink;};return b;});
