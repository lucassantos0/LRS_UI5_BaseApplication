sap.ui.define([ "lrs/ui5/controller/BaseController",
		"sap/ui/core/routing/History" ], function(BaseController, History) {
	"use strict";
	return BaseController.extend("lrs.ui5.controller.MapaComparativoDetalhes",
			{
				onInit : function() {
				},
				onNavBack : function() {
					var oHistory = History.getInstance();
					var sPreviousHash = oHistory.getPreviousHash();

					if (sPreviousHash !== undefined) {
						window.history.go(-1);
					} else {
						var oRouter = sap.ui.core.UIComponent
								.getRouterFor(this);
						oRouter.navTo("home", {}, true);
					}
				}
			});
});