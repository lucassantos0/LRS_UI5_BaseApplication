/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["./BaseContentRenderer"], function (BaseContentRenderer) {
	"use strict";

	/**
	 * AnalyticalContentRenderer renderer.
	 * @author SAP SE
	 * @namespace
	 */
	var AnalyticalContentRenderer = BaseContentRenderer.extend("sap.ui.integration.cards.AnalyticalContentRenderer");

	/**
	 * @override
	 */
	AnalyticalContentRenderer.getMinHeight = function (oConfiguration, oContent) {
		var MIN_ANALYTICAL_CONTENT_HEIGHT = "14rem";

		return MIN_ANALYTICAL_CONTENT_HEIGHT;
	};

	return AnalyticalContentRenderer;
});
