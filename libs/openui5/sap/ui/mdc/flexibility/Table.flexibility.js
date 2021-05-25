/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./SortFlex','./ColumnFlex','./ConditionFlex'],function(S,C,a){"use strict";return{"hideControl":"default","unhideControl":"default",addColumn:C.createAddChangeHandler(),removeColumn:C.createRemoveChangeHandler(),moveColumn:C.createMoveChangeHandler(),removeSort:S.removeSort,addSort:S.addSort,moveSort:S.moveSort,addCondition:a.addCondition,removeCondition:a.removeCondition};});
