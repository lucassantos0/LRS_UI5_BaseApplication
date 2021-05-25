/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/base/Log','sap/ui/mdc/enum/ConditionValidated'],function(L,C){"use strict";var a={createItemCondition:function(k,d,i,o){var v=C.NotValidated;var V=[k,d];if(d===null||d===undefined){V.pop();}else{v=C.Validated;}return this.createCondition("EQ",V,i,o,v);},createCondition:function(o,v,i,O,V){var c={operator:o,values:v,isEmpty:null,validated:V};if(i){c.inParameters=i;}if(O){c.outParameters=O;}return c;},_removeEmptyConditions:function(c){for(var i=c.length-1;i>-1;i--){if(c[i].isEmpty){c.splice(parseInt(i),1);}}return c;}};return a;},true);
