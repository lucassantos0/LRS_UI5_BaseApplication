sap.ui.define(
[
	"lrs/ui5/controller/BaseController"
], function(BaseController)
{
	"use strict";
	return BaseController.extend("lrs.ui5.controller.MapaComparativoLista",
	{
		onInit : function()
		{
		},
		
		onListItemPress : function(oEvent) {					
			var sId = this.byId("listaRfqs").getBinding("items").oModel.getObject(oEvent.getSource().getBindingContextPath()).Id;
			this.getRouter().navTo("MapaComparativoDetalhesCPFL",{ rfq : sId });
		}
		
	});
});