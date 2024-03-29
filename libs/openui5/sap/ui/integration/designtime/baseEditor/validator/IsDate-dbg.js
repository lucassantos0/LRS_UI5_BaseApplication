/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/integration/designtime/baseEditor/validator/IsValidBinding"
], function (
	IsValidBinding
) {
	"use strict";

	/**
	 * Validates if the provided value can be parsed to a valid date.
	 *
	 * @namespace sap.ui.integration.designtime.baseEditor.validator.IsDate
	 * @author SAP SE
	 * @version 1.84.12
	 *
	 * @static
	 * @since 1.81
	 * @public
	 * @experimental 1.81
	 */
	return {
		async: false,
		errorMessage: "BASE_EDITOR.VALIDATOR.INVALID_DATE",
		/**
		 * Validator function
		 *
		 * @param {string} sDateString - Date string to validate
		 * @returns {boolean} Validation result
		 *
		 * @public
		 * @function
		 * @name sap.ui.integration.designtime.baseEditor.validator.IsDate.validate
		 */
		validate: function (sDateString) {
			var sDate = new Date(sDateString);
			return sDateString === undefined
				|| IsValidBinding.validate(sDateString, { allowPlainStrings: false })
				|| (sDate && !isNaN(new Date(sDate).getTime()));
		}
	};
});
