sap.ui.define([ "lrs/ui5/controller/BaseController" ], function(BaseController,
		History) {
	"use strict";
	return BaseController
			.extend("lrs.ui5.controller.MapaComparativoDetalhesCPFL",
					{
						onInit : function() {
							this.getRouter().getRoute("MapaComparativoDetalhesCPFL").attachMatched(this.onRouteMatched, this);
						},
						onRouteMatched : function(oEvent) {
							var sPath = decodeURIComponent(oEvent
									.getParameters().arguments.rfq);
							if (!sPath) {
								return false;
							}
							var oModel = this.getModel("eventosSourcing")
									.getObject(sPath);
							this.byId("mapaComparativoDetalhesCPFL")
									.bindContext("eventosSourcing>" + sPath);
						}
					});
});
