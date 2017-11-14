sap.ui.define([ "lrs/ui5/controller/BaseController" ],
		function(BaseController) {
			"use strict";
			return BaseController.extend("lrs.ui5.controller.ConsumoContratos",
					{
						onInit : function() {
						},
						formatterMasterListDate : function(sDate) {
							return sDate.substring(6, 8) + "/"
									+ sDate.substring(4, 6) + "/"
									+ substring(1, 4);
						}
					});
		});