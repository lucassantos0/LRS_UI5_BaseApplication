/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/m/CustomListItem','sap/m/CustomListItemRenderer','sap/m/Label'],function(C,a,L){"use strict";var F=C.extend("sap.ui.mdc.filterbar.p13n.FilterGroupLayout",{renderer:a});F.prototype._getFieldPath=function(){return this._sFieldPath;};F.prototype.setFilterField=function(f){this._oFilterField=f;this._sFieldPath=f.getFieldPath();};F.prototype.getContent=function(){var c=[];var l=new L({text:this._oFilterField.getLabel(),required:"{$p13n>required}"});l.addStyleClass("sapUiMdcFilterBarBaseLabel");l.setParent(this);c.push(l);c.push(this._oFilterField);return c;};F.prototype.exit=function(){C.prototype.exit.apply(this,arguments);this._oFilterField=null;this._sFieldPath=null;};return F;});
