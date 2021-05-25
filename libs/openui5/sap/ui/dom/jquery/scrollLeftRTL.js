/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","sap/ui/dom/denormalizeScrollLeftRTL","sap/ui/util/_FeatureDetection","sap/ui/thirdparty/jquery"],function(D,d,_,q){"use strict";var s;if(_.initialScrollPositionIsZero()){if(_.canScrollToNegative()){s=function(o){return o.scrollWidth+o.scrollLeft-o.clientWidth;};}else{s=function(o){return o.scrollWidth-o.scrollLeft-o.clientWidth;};}}else{s=function(o){return o.scrollLeft;};}var S=function(p){var o=this.get(0);if(o){if(p===undefined){return s(o);}else{o.scrollLeft=d(p,o);return this;}}};q.fn.scrollLeftRTL=S;return q;});
