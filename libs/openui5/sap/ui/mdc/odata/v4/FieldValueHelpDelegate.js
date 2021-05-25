/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/mdc/field/FieldValueHelpDelegate','sap/ui/model/FilterType','sap/ui/mdc/odata/v4/TypeUtil'],function(F,a,T){"use strict";var O=Object.assign({},F);O.isSearchSupported=function(p,l){return!!l.changeParameters;};O.executeSearch=function(p,l,s){if(s){l.changeParameters({$search:s});}else{l.changeParameters({$search:undefined});}};O.executeFilter=function(p,l,f,c,r){var _=false;var h=function(P){if(P.mParameters.detailedReason){return;}if(!_){_=true;l.detachEvent("change",h);c();}};l.attachEvent("change",h);l.attachEventOnce("dataReceived",h);l.initialize();l.filter(f,a.Application);l.getContexts(0,r);};O.checkBindingsPending=function(p,b){var P=[];for(var i=0;i<b.length;i++){var B=b[i];if(B&&B.requestValue){P.push(B.requestValue());}}if(P.length>0){return Promise.all(P);}return null;};O.getTypeUtil=function(p){return T;};return O;});
