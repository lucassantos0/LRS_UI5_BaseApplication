sap.ui.define([ "lrs/ui5/controller/BaseController" ], function(BaseController,
		History) {
	"use strict";
	return BaseController.extend(
			"lrs.ui5.controller.MapaComparativoDetalhesCPFL", {
				onInit : function() {
				},
				onRouteMatched : function(oEvent) {
					var sRfq = decodeURIComponent(oEvent.getParameters().arguments.rfq);
					if (!sRfq)
						return false;
					
					//this.byId("mapaComparativoDetalhesCPFL").setBindingContext();
				}
			});
});
