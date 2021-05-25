/*!
* OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["./MicrochartLegendRenderer","sap/m/Text","sap/ui/core/Control","sap/ui/integration/util/BindingHelper"],function(M,T,C,B){"use strict";var a=C.extend("sap.ui.integration.controls.MicrochartLegend",{metadata:{library:"sap.ui.integration",aggregations:{_titles:{type:"sap.m.Text",multiple:true,visibility:"hidden"}},associations:{chart:{type:"sap.ui.core.Control",multiple:false}}},renderer:M});a.prototype.onAfterRendering=function(){this._equalizeWidths();};a.prototype._equalizeWidths=function(){var $=this.$().children(".sapUiIntegrationMicrochartLegendItem"),m=0;$.css("width","");$.each(function(){var c=this.getBoundingClientRect().width;if(c>m){m=c;}});$.css("min-width",m+"px");};a.prototype.initItemsTitles=function(b,p){this.destroyAggregation("_titles");b.forEach(function(c,i){var o=B.prependRelativePaths(c.legendTitle,p+"/"+i);var t=new T({text:o});t.addEventDelegate({onAfterRendering:this._equalizeWidths},this);this.addAggregation("_titles",t);}.bind(this));};return a;});
