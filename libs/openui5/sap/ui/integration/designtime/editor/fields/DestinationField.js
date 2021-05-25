/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/editor/fields/BaseField","sap/m/Select","sap/ui/core/ListItem"],function(B,S,L){"use strict";var D=B.extend("sap.ui.integration.designtime.editor.fields.DestinationField",{renderer:B.getMetadata().getRenderer()});D.prototype.initVisualization=function(c){var v=c.visualization;if(!v){v={type:S,settings:{busy:{path:'currentSettings>_loading'},selectedKey:{path:'currentSettings>value'},width:"100%",items:{path:"currentSettings>_values",template:new L({text:"{currentSettings>name}",key:"{currentSettings>name}"})}}};}this._visualization=v;};return D;});
