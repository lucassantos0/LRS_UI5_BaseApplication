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
			//var sId = this.getModel("listaRfqs").getObject().id;
			this.getRouter().navTo("MapaComparativoDetalhesCPFL",{ rfq : encodeURIComponent(oEvent.getSource().getBindingContextPath()) });
		}
	});
});