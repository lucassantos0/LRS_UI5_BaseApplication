/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	'./ItemBaseFlex'
], function(ItemBaseFlex) {
	"use strict";

	var oChartItemFlex = Object.assign({}, ItemBaseFlex);

	oChartItemFlex.beforeAddItem = function(Delegate, sDataPropertyName, oControl, mPropertyBag, oChangeContent) {
		return Delegate.addItem.call(Delegate, sDataPropertyName, oControl, mPropertyBag, oChangeContent.role);
	};

	oChartItemFlex.findItem = function(oModifier, aItems, sName) {
		return aItems.find(function(oItem) {
			var sKey = oModifier.getProperty(oItem, "key");
			return sKey === sName;
		});
	};

	oChartItemFlex.addItem = oChartItemFlex.createAddChangeHandler();
	oChartItemFlex.removeItem = oChartItemFlex.createRemoveChangeHandler();
	oChartItemFlex.moveItem = oChartItemFlex.createMoveChangeHandler();

	return oChartItemFlex;

});
