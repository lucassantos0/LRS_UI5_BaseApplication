/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(){"use strict";var s,m,b;s=document.getElementById("sap-ui-bootstrap");if(s){m=/^(?:.*\/)?resources\//.exec(s.getAttribute("src"));if(m){b=m[0];}}if(b==null){throw new Error("sap-ui-boot.js: could not identify script tag!");}function l(u,c){var a=u.length,d=0;if(a===0){c();return;}function f(e){a--;if(e.type==='error'){d++;}e.target.removeEventListener("load",f);e.target.removeEventListener("error",f);if(a===0&&d===0&&c){c();}}for(var i=0;i<u.length;i++){var g=document.createElement("script");g.addEventListener("load",f);g.addEventListener("error",f);g.src=b+u[i];document.head.appendChild(g);}}var p=[];if(/(trident)\/[\w.]+;.*rv:([\w.]+)/i.test(window.navigator.userAgent)){p.push("sap/ui/thirdparty/baseuri.js");p.push("sap/ui/thirdparty/es6-promise.js");p.push("sap/ui/thirdparty/es6-shim-nopromise.js");}else if(/(edge)[ \/]([\w.]+)/i.test(window.navigator.userAgent)||/Version\/(11\.0).*Safari/.test(window.navigator.userAgent)){p.push("sap/ui/thirdparty/es6-promise.js");}l(p,function(){l(["ui5loader.js"],function(){sap.ui.loader.config({async:true});l(["ui5loader-autoconfig.js"]);});});}());
