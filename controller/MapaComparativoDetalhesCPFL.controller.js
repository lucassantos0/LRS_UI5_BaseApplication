sap.ui.define([ "lrs/ui5/controller/BaseController" ], function(BaseController,
		History) {
	"use strict";
	return BaseController.extend(
			"lrs.ui5.controller.MapaComparativoDetalhesCPFL", {
				onInit : function() {
				},
				onRouteMatched : function(oEvent) {
					var sLifnr = oEvent.getParameters().arguments.rfq;
					if (!rfq)
						return false;
					
					this.byId("mapaComparativoDetalhesCPFL").setBindingContext();
					var oBinding = this.byId("tableTodosTrechos").getBinding(
							"rows");
					var aFilters = [];
					aFilters.push(new sap.ui.model.Filter("Lifnr",
							sap.ui.model.FilterOperator.EQ, sLifnr));
					oBinding.filter(aFilters);
				}
			});
});
