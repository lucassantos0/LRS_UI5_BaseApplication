/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Core","./GridTableType"],function(C,G){"use strict";var I;var V=G.extend("sap.ui.mdc.table.V4AnalyticsTableType",{metadata:{properties:{}}});V.loadTableModules=function(){return Promise.all([G.loadTableModules(),new Promise(function(r,a){sap.ui.require(["sap/ui/table/plugins/V4Aggregation"],function(b){I=b;r();},function(){a("Failed to load V4Aggregation plugin");});})]);};V.createV4AggregationPlugin=function(t){var v=C.byId(t.getId()+"--mV4Aggregation");return v?v:new I(t.getId()+"--mV4Aggregation");};V.prototype.updateTableSettings=function(){this.getRelevantTable().addDependent(V.createV4AggregationPlugin(this.getParent()));G.prototype.updateTableSettings.call(this,G.getMetadata().getProperties());};return V;});
