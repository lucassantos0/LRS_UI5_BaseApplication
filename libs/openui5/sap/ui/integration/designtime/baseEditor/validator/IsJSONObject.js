/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/validator/IsValidBinding","sap/base/util/restricted/_isNil"],function(I,_){"use strict";return{async:false,errorMessage:"BASE_EDITOR.VALIDATOR.NOT_A_JSONOBJECT",validate:function(v){var i=false;if(typeof v==="object"&&Object.prototype.toString.call(v).toLowerCase()==="[object object]"&&!v.length){i=true;}return _(v)||i||I.validate(v,{allowPlainStrings:false});}};});
