/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Locale",'sap/base/util/isPlainObject',"sap/base/Log"],function(L,i,a){"use strict";var U={};U.isJson=function(t){if(typeof t!=="string"){return false;}try{JSON.parse(t);return true;}catch(e){return false;}};U.processFormatArguments=function(f,l){var F=i(f)?f:{},o=typeof f==="string"?new L(f):(l&&new L(l));return{formatOptions:F,locale:o};};var J=1,b=2,c=3;U.parseJsonDateTime=function(d){var r=/^\/Date\((-?\d+)(\+|-)?(\d+)?\)\/$/,j;if(typeof d==="string"){j=r.exec(d);}if(j){var R=new Date(parseInt(j[J]));if(j[b]){var m=parseInt(j[c]);if(j[b]==="-"){m=-m;}var C=R.getUTCMinutes();R.setUTCMinutes(C-m);}if(isNaN(R.valueOf())){a.error("Invalid JSON Date format - "+d);}else{d=R;}}return d;};U.DEFAULT_PROMISE_TIMEOUT=5000;U.timeoutPromise=function(p,t){var d;if(t===undefined){t=U.DEFAULT_PROMISE_TIMEOUT;}d=new Promise(function(r,e){setTimeout(function(){e("The promise was not resolved after "+t+" ms so it timed out.");},t);});return Promise.race([p,d]);};return U;});
