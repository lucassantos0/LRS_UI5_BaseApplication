/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/write/_internal/flexState/compVariants/CompVariantState","sap/ui/fl/write/_internal/transport/TransportSelection","sap/ui/fl/registry/Settings","sap/ui/fl/apply/_internal/flexState/ManifestUtils"],function(C,T,S,M){"use strict";function g(c){return c&&c.getPersistencyKey&&c.getPersistencyKey();}function s(p,f){p.persistencyKey=g(p.control);if(!p.reference){p.reference=M.getFlexReferenceForControl(p.control);}return f(p);}var a={add:function(p){return s(p,C.add);},save:function(p){return s(p,C.persist);},setDefaultVariantId:function(p){return s(p,C.setDefault);},setExecuteOnSelect:function(p){return s(p,C.setExecuteOnSelect);},isVariantSharingEnabled:function(){return S.getInstance().then(function(i){return i.isVariantSharingEnabled();});},_getTransportSelection:function(){return new T();}};return a;},true);
