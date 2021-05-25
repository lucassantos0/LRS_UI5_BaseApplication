/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/registry/Settings","sap/ui/fl/Utils","sap/ui/fl/Layer"],function(S,F,L){"use strict";var a={isPublishAvailable:function(){return S.getInstance().then(function(s){return!s.isProductiveSystem();});},isSaveAsAvailable:function(l){return S.getInstance().then(function(s){if(s.isAppVariantSaveAsEnabled()&&l===L.CUSTOMER&&!!sap.ushell_abap){return true;}return false;});},isKeyUser:function(){return S.getInstance().then(function(s){return s.isKeyUser();});},isVersioningEnabled:function(l){return S.getInstance().then(function(s){return s.isVersioningEnabled(l);});}};return a;});
