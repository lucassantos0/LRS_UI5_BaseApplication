sap.ui.define(
[
	"lrs/ui5/controller/BaseController"
], function(BaseController)
{
	"use strict";
	return BaseController.extend("lrs.ui5.controller.Home",
	{
		onInit : function()
		{
		},
		navToTile1Action1 : function()
		{
			this.getRouter().navTo("Tile1Action1");
		},
		navToTile1Action2 : function(){
			this.getRouter().navTo("Tile1Action2");
		},
		navToMapaComparativo : function(){
			this.getRouter().navTo("MapaComparativoLista");
		},
		navToConsumoContratos : function(){
			this.getRouter().navTo("ConsumoContratos");
		},
		navToPortalFornecedor : function(){
			this.getRouter().navTo("PortalFornecedor");
		}		
	});
});