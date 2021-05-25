/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/editor/fields/BaseField","sap/m/Input","sap/m/Text","sap/m/MultiComboBox","sap/ui/core/ListItem"],function(B,I,T,M,L){"use strict";var b=B.extend("sap.ui.integration.designtime.editor.fields.ListField",{renderer:B.getMetadata().getRenderer()});b.prototype.initVisualization=function(c){var v=c.visualization;if(!v){if(c.editable){if(c.values){var i=new L(c.values.item);v={type:M,settings:{selectedKeys:{path:'currentSettings>value'},editable:{path:'currentSettings>editable'},showSecondaryValues:true,width:"100%",items:{path:"",template:i}}};}else{v={type:I,settings:{value:{path:'currentSettings>value',formatter:function(a){a=a||[];return a.join(",");}},change:function(e){var s=e.getSource();s.getBinding("value").setRawValue(s.getValue().split(","));},editable:c.editable,placeholder:c.placeholder}};}}else{v={type:T,settings:{text:{path:'currentSettings>value'},wrapping:false}};}}this._visualization=v;};return b;});
