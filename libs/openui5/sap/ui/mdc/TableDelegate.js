/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/AggregationBaseDelegate","./table/Column","sap/m/Text",'sap/ui/core/Core','sap/ui/mdc/util/FilterUtil'],function(A,C,T,a,F){"use strict";var b=Object.assign(A,{addItem:function(p,t,P){if(t.getModel){return this._createColumn(p,t);}return Promise.resolve(null);},removeItem:function(p,t,P){return Promise.resolve(true);},updateBindingInfo:function(m,M,B){if(!m){return;}if(M&&B){B.path=B.path||M.collectionPath||"/"+M.collectionName;B.model=B.model||M.model;}if(!B){B={};}var f=a.byId(m.getFilter()),c=m.isFilteringEnabled(),d;var o=c?m:f;if(o){var p=c?[]:f.getPropertyInfoSet();d=o.getConditions();var e=F.getFilterInfo(o,d,p);B.filters=e.filters;}},rebindTable:function(m,r){if(m&&m._oTable&&r){m._oTable.bindRows(r);}},_createColumn:function(p,t){return this.fetchProperties(t).then(function(P){var o=P.find(function(c){return c.name===p;});if(!o){return null;}return this._createColumnTemplate(o).then(function(c){var d=this._getColumnInfo(o);d.template=c;return new C(t.getId()+"--"+o.name,d);}.bind(this));}.bind(this));},getFilterDelegate:function(){return{addFilterItem:function(p,t){return Promise.resolve(null);}};},_getColumnInfo:function(p){return{header:p.label,dataProperty:p.name,hAlign:p.align,width:p.width};},_getColumnTemplateInfo:function(p){return{text:{path:p.path||p.name},textAlign:p.align};},_createColumnTemplate:function(p){return Promise.resolve(new T(this._getColumnTemplateInfo(p)));}});return b;});
