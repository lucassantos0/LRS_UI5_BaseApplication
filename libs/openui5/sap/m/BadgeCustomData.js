/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/CustomData','sap/base/Log'],function(C,L){"use strict";var B=C.extend("sap.m.BadgeCustomData",{metadata:{properties:{visible:{type:"boolean",group:"Appearance",defaultValue:true}}}});B.prototype.init=function(){var p=this.getParent();if(p&&!p.isA("sap.m.IBadge")){L.warning("BadgeCustomData must be attached only to controls, which implement sap.m.IBadge");}};B.prototype.setValue=function(v){if(this.getValue()===v){return this;}var p=this.getParent();C.prototype.setValue.call(this,v);if(p&&typeof v==="string"){p.updateBadgeValue(v);}return this;};B.prototype.setVisible=function(v){if(this.getVisible()===v){return this;}this.setProperty("visible",v,true);var p=this.getParent();if(p){p.updateBadgeVisibility(v);}return this;};B.prototype.setKey=function(){return this;};return B;});
