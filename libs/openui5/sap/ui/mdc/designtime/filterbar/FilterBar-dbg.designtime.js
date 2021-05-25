/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the Design Time Metadata for the sap.ui.mdc.FilterBar control
sap.ui.define([], function() {
	"use strict";

	return {
		actions: {
			settings: function () {
				return {
					handler: function (oControl, mPropertyBag) {
						return oControl.getRTASettingsActionHandler(mPropertyBag, "Filter");
					}
				};
			}
		}
	};
});
