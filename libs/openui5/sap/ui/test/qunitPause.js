/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define("sap/ui/test/qunitPause",[],function(){"use strict";var P={NONE:"none",POLL:"poll"};var _=P.NONE;var a=false;function s(){return _.indexOf(P.POLL)>-1;}function p(i,c){QUnit.begin(function(){a=false;});var C=false;if(!QUnit){throw new Error("QUnitPause should start polling after QUnit is loaded!");}else if(a){c({qunitDone:true});}else if(s()){QUnit.done(function(){a=true;if(!C){c({qunitDone:true});}});setTimeout(function(){if(!a&&!C){C=true;c({qunitDone:false});}},i);}}function b(r){var i=false;for(var k in P){if(P[k]===r){i=true;}}return i;}return{PAUSE_RULES:P,get pauseRule(){return _;},set pauseRule(r){var R=r.split(",");_="";var n=R.filter(b).join(",");_=n?n:P.NONE;},shouldPoll:s,pollForQUnitDone:p};},true);
