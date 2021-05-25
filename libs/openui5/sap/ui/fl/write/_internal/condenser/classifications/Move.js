/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/write/_internal/condenser/Utils"],function(C){"use strict";return{addToReconstructionMap:function(u,c){var s=C.getContainerElementIds(c.sourceContainer,c.sourceAggregation);var t=C.getContainerElementIds(c.targetContainer,c.targetAggregation);var a;var T;if(c.targetContainer===c.sourceContainer&&c.targetAggregation===c.sourceAggregation){a=C.getInitialUIContainerElementIds(u,c.targetContainer,c.targetAggregation,t);T=a.indexOf(c.affectedControl);C.shiftElement(a,T,c.sourceIndex);}else{a=C.getInitialUIContainerElementIds(u,c.targetContainer,c.targetAggregation,t);T=a.indexOf(c.affectedControl);a.splice(T,1);a=C.getInitialUIContainerElementIds(u,c.sourceContainer,c.sourceAggregation,s);a.splice(c.sourceIndex,0,c.affectedControl);}},simulate:function(c,o,i){var a=o.affectedControl;var s=i.indexOf(a);C.extendElementsArray(c,s,undefined,a);}};});
