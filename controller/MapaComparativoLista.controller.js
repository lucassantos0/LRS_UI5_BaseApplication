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
			this.getRouter().navTo("MapaComparativoDetalhes",{ rfq : "600289020" });
		}
	});
});