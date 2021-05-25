/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Component","sap/ui/fl/apply/_internal/flexState/FlexState","sap/ui/fl/ChangePersistence","sap/ui/fl/Utils"],function(C,F,a,U){"use strict";var b={};b._instanceCache={};b.getChangePersistenceForComponent=function(c){var o=b._instanceCache[c];if(!o){var d={name:c};o=new a(d);b._instanceCache[c]=o;}return o;};b.getChangePersistenceForControl=function(c){var s;s=U.getComponentClassName(c);return b.getChangePersistenceForComponent(s);};b.registerLoadComponentEventHandler=function(){C._fnLoadComponentCallback=this._onLoadComponent.bind(this);};b._onLoadComponent=function(c,m){if(!U.isApplication(m)||!c.id){return;}F.initialize({componentData:c.componentData||(c.settings&&c.settings.componentData),asyncHints:c.asyncHints,manifest:m,componentId:c.id});};return b;},true);
