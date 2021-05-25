/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/integration/designtime/editor/fields/BaseField",
	"sap/m/Input",
	"sap/ui/model/type/Float"
], function (
	BaseField, Input, FloatType
) {
	"use strict";

	/**
	 * @class
	 * @extends sap.ui.integration.designtime.editor.fields.BaseField
	 * @alias sap.ui.integration.designtime.editor.fields.NumberField
	 * @author SAP SE
	 * @since 1.83.0
	 * @version 1.84.12
	 * @private
	 * @experimental since 1.83.0
	 * @ui5-restricted
	 */
	var NumberField = BaseField.extend("sap.ui.integration.designtime.editor.fields.NumberField", {
		renderer: BaseField.getMetadata().getRenderer()
	});
	NumberField.prototype.initVisualization = function (oConfig) {
		var oVisualization = oConfig.visualization;
		if (!oVisualization) {
			oVisualization = {
				type: Input,
				settings: {
					value: { path: 'currentSettings>value', type: new FloatType() },
					editable: { path: 'currentSettings>editable' },
					type: "Number"
				}
			};
		}
		this._visualization = oVisualization;
	};

	return NumberField;
});