/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";return{isAbove:function(i,e){var y=i.getDomRef().getBoundingClientRect().top,Y=e.getBoundingClientRect().top;return Y-y<0;},isBelow:function(i,e){var y=i.getDomRef().getBoundingClientRect().top,Y=e.getBoundingClientRect().top;return Y-y>0;},findClosest:function(i,e){var c=null,C=Number.POSITIVE_INFINITY,x=i.getDomRef().getBoundingClientRect().left,y=i.getDomRef().getBoundingClientRect().top;e.forEach(function(E){var X=E.getBoundingClientRect().left,Y=E.getBoundingClientRect().top;var d=(X-x)*(X-x)+(Y-y)*(Y-y);if(d<C){c=E;C=d;}});return c;},findClosestGridContainer:function(i,e){var c=null,C=Number.POSITIVE_INFINITY,y=i.getDomRef().getBoundingClientRect().top;e.forEach(function(E){var Y=E.getBoundingClientRect().top;var d=(Y-y)*(Y-y);if(d<C){c=E;C=d;}});return c;}};});
