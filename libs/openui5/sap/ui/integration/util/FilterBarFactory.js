/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/m/library","sap/m/HBox","sap/ui/integration/cards/Filter"],function(B,l,H,F){"use strict";var a=l.FlexWrap;var R=l.FlexRendertype;var b=B.extend("sap.ui.integration.util.FilterBarFactory",{metadata:{library:"sap.ui.integration"},constructor:function(c){B.call(this);this._oCard=c;}});b.prototype.create=function(f,m){var c=[],r=[],C,k,o,d;for(k in f){C=f[k];o=new F({card:this._oCard,key:k,config:C,value:m[k]?m[k].value:C.value});this._awaitEvent(r,o,"_ready");o._setDataConfiguration(C.data);c.push(o);}if(!c.length){return null;}for(var i=0;i<c.length-1;i++){c[i].addStyleClass("sapUiTinyMarginEnd");}d=new H({wrap:a.Wrap,renderType:R.Bare,items:c});Promise.all(r).then(function(){d.fireEvent("_filterBarDataReady");});return d;};b.prototype._awaitEvent=function(p,f,e){p.push(new Promise(function(r){f.attachEventOnce(e,function(){r();});}));};return b;});
