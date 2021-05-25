/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./FilterItemFlex','./ConditionFlex'],function(F,C){"use strict";return{"addFilter":F.createAddChangeHandler(),"removeFilter":F.createRemoveChangeHandler(),"moveFilter":F.createMoveChangeHandler(),"addCondition":C.addCondition,"removeCondition":C.removeCondition};},true);
