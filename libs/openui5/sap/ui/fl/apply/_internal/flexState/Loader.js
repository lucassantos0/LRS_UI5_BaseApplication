/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/_internal/flexState/ManifestUtils","sap/ui/fl/initial/_internal/Storage","sap/ui/fl/Utils"],function(M,A,U){"use strict";function _(f){return{changes:f,cacheKey:f.cacheKey};}return{loadFlexData:function(p){var c=M.getBaseComponentNameFromManifest(p.manifest);if(p.partialFlexData){return A.completeFlexData({reference:p.reference,componentName:c,partialFlexData:p.partialFlexData}).then(_);}return A.loadFlexData({reference:p.reference,componentName:c,cacheKey:M.getCacheKeyFromAsyncHints(p.asyncHints),siteId:U.getSiteIdByComponentData(p.componentData),appDescriptor:p.manifest.getRawJson?p.manifest.getRawJson():p.manifest,version:p.version}).then(_);}};});
