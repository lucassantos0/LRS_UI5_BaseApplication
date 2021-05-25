/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/each"],function(e){"use strict";return{addToChangesMap:function(p,u,c){if(!p[u]){p[u]=[];}p[u].push(c);},getChangesFromMap:function(o,u){var c=[];e(o[u],function(k,r){r.reverse();var C;r.forEach(function(a){if(C&&C.getChangeType()!==a.getChangeType()){C=null;}else{C=a;}});if(C){c.push(C);}});return c;}};});
