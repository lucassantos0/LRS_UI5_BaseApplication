sap.ui.define([ "lrs/ui5/controller/BaseController" ],
		function(BaseController) {
			"use strict";
			return BaseController.extend("lrs.ui5.controller.ConsumoContratos",
					{
						onInit : function() {
						},
						formatterMasterListDate : function(sDate) {
							var str = sDate;
							return str.substring(6, 8) + "/"
									+ str.substring(4, 6) + "/"
									+ str.substring(0, 4);
						}
					});
		});