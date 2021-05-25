/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/mdc/util/IdentifierUtil',"sap/ui/mdc/condition/ConditionConverter",'sap/ui/mdc/condition/FilterConverter','sap/base/Log','sap/base/util/merge'],function(I,C,F,L,m){"use strict";var a={getPropertyByKey:function(p,k){var P=null;p.some(function(o){if(I.getPropertyKey(o)===k){P=o;}return P!=null;});return P;},getFilterInfo:function(M,c,p,b){var f={};if(!M){L.error("not an mdc control");return f;}if(!M.bDelegateInitialized||!M.getTypeUtil()){L.error("typeUtil not available");return f;}b=b?b:[];var i,s,d={},o;var e={};if(p&&p.length>0){for(s in c){if(b.indexOf(s)<0){var P=a.getPropertyByKey(p,s);if(P){e[s]={type:P.typeConfig.typeInstance};d[s]=[];for(i=0;i<c[s].length;i++){o=m({},c[s][i]);d[s].push(C.toType(o,P.typeConfig,M.getTypeUtil()));}}else{L.error("no such property: "+s);}}}if(Object.keys(d).length>0){f.filters=F.createFilters(d,e);}}return f;}};return a;},true);
