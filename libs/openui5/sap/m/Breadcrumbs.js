/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/util/openWindow","sap/m/Text","sap/m/Link","sap/m/Select","sap/ui/core/Item","sap/ui/core/delegate/ItemNavigation","sap/ui/core/ResizeHandler","sap/ui/core/IconPool","sap/ui/Device","sap/m/library","./BreadcrumbsRenderer"],function(C,o,T,L,S,I,a,R,b,D,l,B){"use strict";var c=l.SelectType,d=l.BreadcrumbsSeparatorStyle;var e=C.extend("sap.m.Breadcrumbs",{metadata:{library:"sap.m",interfaces:["sap.m.IBreadcrumbs"],designtime:"sap/m/designtime/Breadcrumbs.designtime",properties:{currentLocationText:{type:"string",group:"Behavior",defaultValue:null},separatorStyle:{type:"sap.m.BreadcrumbsSeparatorStyle",group:"Appearance",defaultValue:d.Slash}},aggregations:{links:{type:"sap.m.Link",multiple:true,singularName:"link"},_currentLocation:{type:"sap.m.Text",multiple:false,visibility:"hidden"},_select:{type:"sap.m.Select",multiple:false,visibility:"hidden"}},defaultAggregation:"links"}});e.STYLE_MAPPER={Slash:"/",BackSlash:"\\",DoubleSlash:"//",DoubleBackSlash:"\\\\",GreaterThan:">",DoubleGreaterThan:">>"};e.prototype.init=function(){this._sSeparatorSymbol=e.STYLE_MAPPER[this.getSeparatorStyle()];};e.prototype.onBeforeRendering=function(){this.bRenderingPhase=true;if(this._sResizeListenerId){R.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}if(this._bControlsInfoCached){this._updateSelect(true);}};e.prototype.onAfterRendering=function(){if(!this._sResizeListenerId){this._sResizeListenerId=R.register(this,this._handleScreenResize.bind(this));}if(!this._bControlsInfoCached){this._updateSelect(true);return;}this._configureKeyboardHandling();this.bRenderingPhase=false;};e.prototype.onThemeChanged=function(){this._resetControl();};e.prototype.exit=function(){this._resetControl();this._destroyItemNavigation();};e.PAGEUP_AND_PAGEDOWN_JUMP_SIZE=5;e.prototype._getAugmentedId=function(s){return this.getId()+"-"+s;};e.prototype._getSelect=function(){if(!this.getAggregation("_select")){this.setAggregation("_select",this._decorateSelect(new S({id:this._getAugmentedId("select"),change:this._selectChangeHandler.bind(this),forceSelection:false,autoAdjustWidth:true,icon:b.getIconURI("slim-arrow-down"),type:c.IconOnly,tooltip:B._getResourceBundleText("BREADCRUMB_SELECT_TOOLTIP")})),true);}return this.getAggregation("_select");};e.prototype._getCurrentLocation=function(){if(!this.getAggregation("_currentLocation")){var h=new T({id:this._getAugmentedId("currentText"),text:this.getCurrentLocationText(),wrapping:false}).addStyleClass("sapMBreadcrumbsCurrentLocation");h.addEventDelegate({onAfterRendering:function(){h.$().attr("aria-current","page");}});this.setAggregation("_currentLocation",h).addStyleClass("sapMBreadcrumbsCurrentLocation");}return this.getAggregation("_currentLocation");};function f(A,h){var i=Array.prototype.slice.apply(h);i.unshift(A);return i;}e.prototype.insertLink=function(h,i){var r=this.insertAggregation.apply(this,f("links",arguments));this._registerControlListener(h);this._resetControl();return r;};e.prototype.addLink=function(h){var r=this.addAggregation.apply(this,f("links",arguments));this._registerControlListener(h);this._resetControl();return r;};e.prototype.removeLink=function(O){var r=this.removeAggregation.apply(this,f("links",arguments));this._deregisterControlListener(r);this._resetControl();return r;};e.prototype.removeAllLinks=function(){var h=this.getAggregation("links",[]);var r=this.removeAllAggregation.apply(this,f("links",arguments));h.forEach(this._deregisterControlListener,this);this._resetControl();return r;};e.prototype.destroyLinks=function(){var h=this.getAggregation("links",[]);var r=this.destroyAggregation.apply(this,f("links",arguments));h.forEach(this._deregisterControlListener,this);this._resetControl();return r;};e.prototype._decorateSelect=function(s){s.getPicker().attachAfterOpen(this._removeItemNavigation,this).attachBeforeClose(this._restoreItemNavigation,this);s._onBeforeOpenDialog=this._onSelectBeforeOpenDialog.bind(this);s._onBeforeOpenPopover=this._onSelectBeforeOpenPopover.bind(this);s.onsapescape=this._onSelectEscPress.bind(this);return s;};e.prototype._removeItemNavigation=function(){this.removeDelegate(this._getItemNavigation());};e.prototype._onSelectBeforeOpenDialog=function(){var s=this._getSelect();if(this.getCurrentLocationText()&&D.system.phone){s.setSelectedIndex(0);}else{s.setSelectedItem(null);}S.prototype._onBeforeOpenDialog.call(s);this._removeItemNavigation();};e.prototype._onSelectBeforeOpenPopover=function(){this._getSelect().setSelectedItem(null);this._removeItemNavigation();};e.prototype._restoreItemNavigation=function(){this.addDelegate(this._getItemNavigation());};e.prototype._onSelectEscPress=function(){this._getSelect().close();};e.prototype._createSelectItem=function(i){return new I({key:i.getId(),text:i.getText()});};e.prototype._selectChangeHandler=function(E){var h,s,i,j=E.getParameter("selectedItem");if(!j){return;}if(!this._getSelect().isOpen()){return;}h=sap.ui.getCore().byId(j.getKey());if(!(h instanceof L)){return;}s=h.getHref();i=h.getTarget();h.firePress();if(s){if(i){o(s,i);}else{window.location.href=s;}}};e.prototype._getItemsForMobile=function(){var i=this.getLinks();if(this.getCurrentLocationText()){i.push(this._getCurrentLocation());}return i;};e.prototype._updateSelect=function(i){var s=this._getSelect(),h,j=this._getControlDistribution();if(!this._bControlDistributionCached||i){s.destroyItems();h=D.system.phone?this._getItemsForMobile():j.aControlsForSelect;h.map(this._createSelectItem).reverse().forEach(s.insertItem,s);this._bControlDistributionCached=true;this.invalidate(this);}s.setVisible(!!j.aControlsForSelect.length);if(!this._sResizeListenerId&&!this.bRenderingPhase){this._sResizeListenerId=R.register(this,this._handleScreenResize.bind(this));}};e.prototype._getControlsForBreadcrumbTrail=function(){var v;if(this._bControlDistributionCached&&this._oDistributedControls){return this._oDistributedControls.aControlsForBreadcrumbTrail;}v=this.getLinks().filter(function(h){return h.getVisible();});if(this.getCurrentLocationText()){return v.concat([this._getCurrentLocation()]);}return v;};e.prototype._getControlInfo=function(h){return{id:h.getId(),control:h,width:g(h.$().parent()),bCanOverflow:h instanceof L};};e.prototype._getControlDistribution=function(m){m=m||this._iContainerSize;this._iContainerSize=m;this._oDistributedControls=this._determineControlDistribution(m);return this._oDistributedControls;};e.prototype._getSelectWidth=function(){return this._getSelect().getVisible()&&this._iSelectWidth||0;};e.prototype._determineControlDistribution=function(m){var i,h,j=this._getControlsInfo().aControlInfo,s=this._getSelectWidth(),k=[],n=[],u=s;for(i=j.length-1;i>=0;i--){h=j[i];u+=h.width;if(j.length-1===i){n.push(h.control);continue;}if(i===0){u-=s;}if(u>m&&h.bCanOverflow){k.unshift(h.control);}else{n.unshift(h.control);}}return{aControlsForBreadcrumbTrail:n,aControlsForSelect:k};};e.prototype._getControlsInfo=function(){if(!this._bControlsInfoCached){this._iSelectWidth=g(this._getSelect().$().parent())||0;this._aControlInfo=this._getControlsForBreadcrumbTrail().map(this._getControlInfo);this._iContainerSize=g(this.$());this._bControlsInfoCached=true;}return{aControlInfo:this._aControlInfo,iSelectWidth:this._iSelectWidth,iContentSize:this._iContainerSize};};e.prototype._handleScreenResize=function(E){var i=this._oDistributedControls.aControlsForBreadcrumbTrail.length,h=this._getControlDistribution(E.size.width),j=h.aControlsForBreadcrumbTrail.length;if(i!==j){this._updateSelect(true);}return this;};e.prototype._getItemsToNavigate=function(){var i=this._getControlsForBreadcrumbTrail().slice(),s=this._getSelect();if(s.getVisible()){i.unshift(s);}return i;};e.prototype._getItemNavigation=function(){if(!this._itemNavigation){this._itemNavigation=new a();}return this._itemNavigation;};e.prototype._destroyItemNavigation=function(){if(this._itemNavigation){this.removeEventDelegate(this._itemNavigation);this._itemNavigation.destroy();this._itemNavigation=null;}};e.prototype._configureKeyboardHandling=function(){var i=this._getItemNavigation(),s=-1,h=this._getItemsToNavigate(),n=[];if(h.length===0){return;}h.forEach(function(j,k){if(k===0){j.$().attr("tabindex","0");}j.$().attr("tabindex","-1");n.push(j.getDomRef());});this.addDelegate(i);i.setDisabledModifiers({sapnext:["alt"],sapprevious:["alt"],saphome:["alt"],sapend:["alt"]});i.setCycling(false);i.setPageSize(e.PAGEUP_AND_PAGEDOWN_JUMP_SIZE);i.setRootDomRef(this.getDomRef());i.setItemDomRefs(n);i.setSelectedIndex(s);return this;};e.prototype._registerControlListener=function(h){if(h){h.attachEvent("_change",this._resetControl,this);}};e.prototype._deregisterControlListener=function(h){if(h){h.detachEvent("_change",this._resetControl,this);}};e.prototype.setCurrentLocationText=function(t){var h=this._getCurrentLocation(),r=this.setProperty("currentLocationText",t,true);if(h.getText()!==t){h.setText(t);this._resetControl();}return r;};e.prototype.setSeparatorStyle=function(s){this.setProperty("separatorStyle",s);var h=e.STYLE_MAPPER[this.getSeparatorStyle()];if(h){this._sSeparatorSymbol=h;}return this;};e.prototype._resetControl=function(){this._aControlInfo=null;this._iContainerSize=null;this._bControlsInfoCached=null;this._bControlDistributionCached=null;this._oDistributedControls=null;if(this._sResizeListenerId){R.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}this.removeDelegate(this._getItemNavigation());this.invalidate(this);return this;};function g($){var m;if($.length){m=$.outerWidth(true)-$.outerWidth();return $.get(0).getBoundingClientRect().width+m;}}return e;});
