/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/delegate/ItemNavigation","sap/ui/events/KeyCodes"],function(I,K){"use strict";var G=I.extend("sap.f.delegate.GridItemNavigation",{metadata:{library:"sap.f",properties:{},events:{}}});G.prototype.onsapnext=function(e){I.prototype.onsapnext.call(this,e);};G.prototype.onsapprevious=function(e){I.prototype.onsapprevious.call(this,e);};return G;});
