/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/ObjectPath","sap/base/Log","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/dt/ElementUtil","sap/ui/fl/apply/api/DelegateMediatorAPI","sap/ui/rta/util/BindingsExtractor","sap/ui/thirdparty/jquery"],function(O,L,J,E,D,B,q){"use strict";function _(j,H,M){if(!j){return false;}var I=j.getBindingInfo(H,M);var P=I&&I.path;if(!P){return false;}if(P.indexOf(">")>-1){P=P.split(">").pop();}return P.indexOf("/")===0;}function a(j,H,I,M){var K;if(H){K=j.getBindingInfo(I,M);if(typeof K.model==="string"&&K.model!==M){K=undefined;}}else{K=j.getBindingContext(M);}return K;}function b(j,H,M){var I=_(j,H,M);var K=a(j,I,H,M);if(K){return I?K.path:K.getPath();}}function c(P){var j=P.reduce(function(H,I){if(Array.isArray(I.properties)){H=H.concat(I.properties.map(function(K){K.parentPropertyName=I.label||I.name;return K;}));}else{H.push(I);}return H;},[]);return j;}function d(j,H,I){var P={element:j,aggregationName:H,payload:I.delegateInfo.payload||{}};return I.delegateInfo.delegate.getPropertyInfo(P).then(c);}function g(j,H){return D.getDelegateForControl({control:j,modifier:J,supportsDefault:true}).then(function(I){if(I&&I.instance){return I.instance.getPropertyInfo({element:j,aggregationName:H,payload:I.payload});}return[];});}function e(j,H,I){var K=I.addViaDelegate;var M;if(K){M=d.bind(null,j,H,K);}else{M=g.bind(null,j,H);}return M().then(function(P){return m(P);});}function f(P){return P.filter(function(j){return!(j.unsupported||j.hideFromReveal);});}function h(P,j){j.type="custom";if(j.id){j.itemId=P+"-"+j.id;j.key=j.itemId;}return j;}function i(P){return{selected:false,label:P.label||P.name,parentPropertyName:P.parentPropertyName?P.parentPropertyName:"",duplicateName:P.duplicateName?P.duplicateName:false,tooltip:P.tooltip||P.label,originalLabel:"",type:"delegate",entityType:P.entityType,name:P.name,bindingPath:P.bindingPath};}function k(j){var H=j.element;var I=j.action;return{selected:false,label:H.__label||E.getLabelForElement(H,I.getLabel),tooltip:H.__tooltip||E.getLabelForElement(H,I.getLabel)||H.__bindingPath,parentPropertyName:H.__parentPropertyName?H.__parentPropertyName:"",duplicateName:H.__duplicateName?H.__duplicateName:false,originalLabel:H.__renamedLabel&&H.__label!==H.__originalLabel?H.__originalLabel:"",bindingPath:H.__bindingPath,type:"invisible",elementId:H.getId()};}function l(j,R,H,M){if(R&&R!==j){var I=b(j,H,M);return E.findAllSiblingsInContainer(j,R).filter(function(S){return I===b(S,H,M);});}return[j];}function m(P){P.forEach(function(M,H,P){if(M["duplicateName"]!==true){for(var j=H+1;j<P.length-1;j++){if(M.label===P[j].label){M["duplicateName"]=true;P[j]["duplicateName"]=true;}}}});return P;}function n(I,P){return P.some(function(M){return M.label===I.__label;});}function o(j){return Array.isArray(j)&&j.length>0;}function p(j,P){return P.filter(function(M){return j.some(function(H){return H.startsWith(M.bindingPath);});}).pop();}function r(j){return(q.isPlainObject(j)?j.parts[0].path:!!j.getPath&&j.getPath());}function s(j,H,M,I){var K=j.getModel(M);var R=l(j,H.relevantContainer,I,M);var N=[];R.forEach(function(j){N=N.concat(B.getBindings(j,K).map(r));});return N;}function t(j,H){var P={element:j.relevantContainer,aggregationName:H,payload:j.delegateInfo.payload||{}};return j.delegateInfo.delegate.getRepresentedProperties(P);}function u(j,H,M,I){return t(H,I).then(function(R){if(R===undefined){return s(j,H,M,I);}var K=[];R.forEach(function(N){K=K.concat(N.bindingPaths);});return K;});}function v(j,H,M,I){return Promise.resolve().then(function(){var K=!!O.get("delegateInfo.delegate.getRepresentedProperties",H);if(K){return u(j,H,M,I);}return s(j,H,M,I);});}function w(I,S){I.__originalLabel=S.label;I.__tooltip=S.tooltip;I.__bindingPath=S.name;if(I.__label!==I.__originalLabel){I.__renamedLabel=true;}if(S.parentPropertyName){I.__parentPropertyName=S.parentPropertyName;}}function x(j,H){var I=!!O.get("delegateInfo.delegate.getRepresentedProperties",j);if(I){return t(j,H);}}function y(I,R){var j;R.some(function(P){if(P.id===I.getId()){j=P;return true;}});return j.bindingPaths||[];}function z(I,P,j){if(!o(j)){return true;}var M=p(j,P);if(M&&!M.hideFromReveal){w(I,M);return true;}return false;}function A(j,H,I,K,R,P){var M=K.addViaDelegate;var N=F(M);var Q=j.getModel(N);var S=true;var T=[];if(R){T=y(I,R);}else if(b(j,H,N)===b(I,H,N)){T=B.collectBindingPaths(I,Q).bindingPaths;}else if(B.getBindings(I,Q).length>0){S=false;}if(S){I.__duplicateName=n(I,P);S=z(I,P,T);}return S;}function C(I,j,H,K){var M=j.addViaCustom;if(M&&H){M.items.forEach(function(N){h(K.getParent().getId(),N);if(N.itemId===I.getId()){w(I,N);}});}}function F(j){return O.get("delegateInfo.payload.modelName",j);}var G={enhanceInvisibleElements:function(j,H){var R=H.reveal;var I=H.addViaDelegate;var K=j.getMetadata().getAggregation();var M=K?K.name:H.aggregation;return Promise.all([e(j,M,H),x(I,M)]).then(function(N){var P=N[0];var Q=N[1];var S=[];var T=R.elements||[];T.forEach(function(U){var V=U.element;var W=U.action;V.__label=E.getLabelForElement(V,W.getLabel);var X=A(j,M,V,H,Q,P);C(V,H,X,j);if(X){S.push({element:V,action:W});}});return S;}).then(function(N){return N.map(k);});},getUnrepresentedDelegateProperties:function(j,H){var M=F(H);var I=j.getMetadata().getAggregation();var K=I?I.name:H.action.aggregation;return Promise.all([d(j,K,H),v(j,H,M,K)]).then(function(N){var P=N[0];var R=N[1];var Q=H.action.filter?H.action.filter:function(){return true;};var U=f(P);U=U.filter(function(S){var T=false;if(R){T=R.some(function(V){return V===S.bindingPath;});}return!T&&Q(H.relevantContainer,S);});U=m(U);return U;}).then(function(U){return U.map(i);});},getCustomAddItems:function(j,H){return new Promise(function(R){if(Array.isArray(H.items)){R(H.items.map(h.bind(null,j.getParent().getId())).filter(function(I){if(!I.id){L.error("CustomAdd item with label "+I.label+" does not contain an 'id' property","sap.ui.rta.plugin.AdditionalElementsAnalyzer#showAvailableElements");return false;}return!E.getElementInstance(I.itemId);}));}else{R();}});},getFilteredItemsList:function(j){var I=j[0];var H=2;var K=j[H];if(K){var M=I.map(function(N){return N.elementId;});j[H]=K.filter(function(N){return!N.itemId||M.indexOf(N.itemId)===-1;});}return j.reduce(function(N,P){return N.concat(P);},[]);}};return G;});
