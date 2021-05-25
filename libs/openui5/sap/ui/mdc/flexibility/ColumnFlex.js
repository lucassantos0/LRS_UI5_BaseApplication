/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/fl/apply/api/FlexRuntimeInfoAPI','./ItemBaseFlex'],function(F,I){"use strict";var c=Object.assign({},I);var r=function(C){if(C&&C.isA&&C.isA("sap.ui.mdc.Table")&&C.isTableBound()){if(!C._bWaitForBindChanges){C._bWaitForBindChanges=true;F.waitForChanges({element:C}).then(function(){C.checkAndRebind();delete C._bWaitForBindChanges;});}}};c.findItem=function(m,C,n){return C.find(function(o){var d=m.getProperty(o,"dataProperty");return d===n;});};c.afterApply=function(C,t,i){if(C==="addColumn"&&!i||(C==="removeColumn"&&i)){r(t);}};c.addColumn=c.createAddChangeHandler();c.removeColumn=c.createRemoveChangeHandler();c.moveColumn=c.createMoveChangeHandler();return c;});
