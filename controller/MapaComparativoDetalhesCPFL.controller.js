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
							var sRfq = oEvent.getParameters().arguments.rfq;
							if (!sRfq) {
								return false;
							}
							var oModel = this.getModel("eventosSourcing");
							var oEntry = null;
							for(var nEntry in oModel.getData().eventosSourcing){
								oEntry = oModel.getData().eventosSourcing[nEntry];
								if(oEntry.rfq === sRfq){
									break;
								}
							}
							this.byId("mapaComparativoDetalhesCPFL").bindContext("eventosSourcing>/eventosSourcing/" + nEntry);
						}
					});
});
