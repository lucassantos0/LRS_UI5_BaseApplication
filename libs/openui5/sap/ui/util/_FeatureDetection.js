/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var d={};function a(){var b=document.createElement("div");b.innerHTML='<div dir="rtl" style="width: 1px; height: 1px; position: fixed; top: 0px; left: 0px; overflow: hidden"><div style="width: 2px"><span style="display: inline-block; width: 1px"></span><span style="display: inline-block; width: 1px"></span></div></div>';document.documentElement.appendChild(b);var c=b.firstChild;d.initialZero=c.scrollLeft==0;c.scrollLeft=-1;d.canNegative=c.scrollLeft<0;document.documentElement.removeChild(b);}a();var _={canScrollToNegative:function(){return d.canNegative;},initialScrollPositionIsZero:function(){return d.initialZero;}};return _;});
