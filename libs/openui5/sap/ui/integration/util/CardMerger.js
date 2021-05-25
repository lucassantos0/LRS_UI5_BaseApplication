/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/merge","sap/ui/model/json/JSONModel"],function(m,J){"use strict";var C={layers:{"admin":0,"content":5,"translation":10,"all":20},mergeManifestPathChanges:function(M,c){Object.keys(c).forEach(function(s){if(s.charAt(0)==="/"){M.setProperty(s,c[s]);}});},mergeCardDelta:function(M,c){var i=m({},M),s="sap.card";if(Array.isArray(c)&&c.length>0){var o;c.forEach(function(a){if(a.content){m(i[s],a.content);}else{o=o||new J(i);C.mergeManifestPathChanges(o,a);}});}return i;},mergeCardDesigntimeMetadata:function(d,c){var i=m({},d);c.forEach(function(o){var I=o.content.entityPropertyChange||[];I.forEach(function(a){var p=a.propertyPath;switch(a.operation){case"UPDATE":if(i.hasOwnProperty(p)){i[p]=a.propertyValue;}break;case"DELETE":delete i[p];break;case"INSERT":if(!i.hasOwnProperty(p)){i[p]=a.propertyValue;}break;default:break;}});});return i;}};return C;});
