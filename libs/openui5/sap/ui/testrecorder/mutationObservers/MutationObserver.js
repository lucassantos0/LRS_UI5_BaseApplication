/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/base/ManagedObject","sap/ui/testrecorder/Constants"],function($,M,c){"use strict";var a=M.extend("sap.ui.testrecorder.mutationObservers.MutationObserver",{metadata:{library:"sap.ui.testrecorder"},constructor:function(C){this._fnObservationCb=C;this._observer=new window.MutationObserver(this._onObservation.bind(this));},start:function(t){this._oTarget=t||document.body;this._observer.observe(this._oTarget,this._getOptions());},stop:function(){this._observer.disconnect();},_getOptions:function(){return{};},_onObservation:function(m){if(this._isValidMutation(m)){this._fnObservationCb();}},_isValidMutation:function(m){var i=true;m.forEach(function(o){if(this._isRecorderElement(o)){i=false;}}.bind(this));return i;},_isRecorderElement:function(m){return[c.HIGHLIGHTER_ID,c.CONTEXTMENU_ID].filter(function(i){return m.target.id===i||(m.addedNodes.length&&m.addedNodes[0].id===i)||(m.removedNodes.length&&m.removedNodes[0].id===i);}).length;}});return a;});
