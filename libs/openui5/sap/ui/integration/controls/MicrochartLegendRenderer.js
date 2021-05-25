/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/library","sap/ui/core/Core","sap/ui/core/theming/Parameters"],function(l,C,P){"use strict";var V=l.ValueColor;var M={apiVersion:2};M.render=function(r,m){var c=C.byId(m.getChart()),L=[],t=m.getAggregation("_titles");if(c){L=c._calculateChartData().map(function(d){return d.color;});}r.openStart("div",m).class("sapUiIntegrationMicrochartLegend").openEnd();L.forEach(function(s,i){r.openStart("div").class("sapUiIntegrationMicrochartLegendItem").openEnd();r.openStart("div");M.addColor(r,s);r.openEnd().close("div");r.renderControl(t[i]);r.close("div");});r.close("div");};M.addColor=function(r,c){if(V[c]){r.class("sapUiIntegrationMicrochartLegendItem"+c);}else{var s=P.get(c)||c;r.style("background",s);}};return M;},true);
