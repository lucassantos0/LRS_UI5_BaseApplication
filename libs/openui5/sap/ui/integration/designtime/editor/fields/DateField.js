/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/editor/fields/BaseField","sap/m/DatePicker"],function(B,D){"use strict";var a=B.extend("sap.ui.integration.designtime.editor.fields.DateField",{renderer:B.getMetadata().getRenderer()});a.prototype.initVisualization=function(c){var V=c.visualization;if(!V){V={type:D,settings:{dateValue:{path:'currentSettings>value',formatter:function(v){return new Date(v);}},editable:{path:'currentSettings>editable'},valueFormat:"YYYY-MM-dd",width:"16rem",change:function(e){if(e.getParameters().valid){var s=e.getSource();s.getBinding("dateValue").setRawValue(s.getValue());s.getBinding("dateValue").checkUpdate();}else{var s=e.getSource();s.getBinding("dateValue").setRawValue("");}}}};}this._visualization=V;};return a;});
