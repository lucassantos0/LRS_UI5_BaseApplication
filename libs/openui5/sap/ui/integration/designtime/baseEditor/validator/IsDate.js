/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/validator/IsValidBinding"],function(I){"use strict";return{async:false,errorMessage:"BASE_EDITOR.VALIDATOR.INVALID_DATE",validate:function(d){var D=new Date(d);return d===undefined||I.validate(d,{allowPlainStrings:false})||(D&&!isNaN(new Date(D).getTime()));}};});
