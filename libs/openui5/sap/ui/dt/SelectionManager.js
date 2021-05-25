/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","sap/ui/dt/OverlayRegistry","sap/ui/dt/Util","sap/ui/dt/SelectionMode","sap/ui/dt/ElementOverlay","sap/base/util/includes"],function(M,O,U,S,E,i){"use strict";var a=M.extend("sap.ui.dt.SelectionManager",{metadata:{events:{change:{parameters:{selection:{type:"sap.ui.dt.ElementOverlay[]"}}}}}});function g(o){return U.castArray(o).map(function(b){if(b instanceof E){return b;}var e=O.getOverlay(b);if(e){return e;}}).filter(function(e,I,b){return e&&b.indexOf(e)===I;});}function s(e){return e.every(function(o){return o.isSelectable();});}a.prototype.init=function(){this._aSelection=[];this._aValidators=[];this.addValidator(s);};a.prototype.exit=function(){delete this._aSelection;delete this._aValidators;};a.prototype.getSelectionMode=function(){return this._aSelection.length>1?S.Multi:S.Single;};a.prototype.get=function(){return this._aSelection.slice();};a.prototype.set=function(o){var e=g(o);var r=false;if(this._validate(e)){var b=this.get().filter(function(c){return!i(e,c);});r=this._remove(b)||r;r=this._add(e)||r;if(r){this.fireChange({selection:this.get()});}}return r;};a.prototype._validate=function(e){return this.getValidators().every(function(v){return v(e);});};a.prototype._add=function(e){var c=this.get();e=e.filter(function(o){return!i(c,o);});if(e.length){var n=c.concat(e);if(this._validate(n)){this._aSelection=n;e.forEach(function(o){o.setSelected(true);},this);return true;}}return false;};a.prototype.add=function(o){if(this._add(g(o))){this.fireChange({selection:this.get()});return true;}return false;};a.prototype._remove=function(e){var c=this.get();var n=c.filter(function(o){return!i(e,o);});if(n.length!==c.length){this._aSelection=n;e.forEach(function(o){o.setSelected(false);});return true;}return false;};a.prototype.remove=function(o){if(this._remove(g(o))){this.fireChange({selection:this.get()});return true;}return false;};a.prototype.reset=function(){return this.remove(this.get());};a.prototype.addValidator=function(v){if(typeof v==="function"&&!i(this._aValidators,v)){this._aValidators=this._aValidators.concat(v);}};a.prototype.removeValidator=function(v){this._aValidators=this._aValidators.filter(function(c){return v!==c;});};a.prototype.getValidators=function(){return this._aValidators.slice();};return a;});
