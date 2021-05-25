/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/editor/fields/BaseField","sap/m/Input","sap/ui/model/type/Integer"],function(B,I,a){"use strict";var b=B.extend("sap.ui.integration.designtime.editor.fields.IntegerField",{renderer:B.getMetadata().getRenderer()});b.prototype.initVisualization=function(c){var v=c.visualization;if(!v){v={type:I,settings:{value:{path:'currentSettings>value',type:new a()},editable:{path:'currentSettings>editable'},type:"Number"}};}this._visualization=v;};return b;});
