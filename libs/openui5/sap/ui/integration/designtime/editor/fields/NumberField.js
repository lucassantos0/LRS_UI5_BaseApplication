/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/editor/fields/BaseField","sap/m/Input","sap/ui/model/type/Float"],function(B,I,F){"use strict";var N=B.extend("sap.ui.integration.designtime.editor.fields.NumberField",{renderer:B.getMetadata().getRenderer()});N.prototype.initVisualization=function(c){var v=c.visualization;if(!v){v={type:I,settings:{value:{path:'currentSettings>value',type:new F()},editable:{path:'currentSettings>editable'},type:"Number"}};}this._visualization=v;};return N;});
