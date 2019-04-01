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
			var sId = this.getModel("listaRfqs").getObject(oEvent.getSource().getBindingContextPath()).id;
			this.getRouter().navTo("MapaComparativoDetalhesCPFL",{ rfq : sId }); 
		},
		
		  openAriba: function(){ 
				window.open("https://paranapanema-t.sourcing.ariba.com","_blank"); 
			  }		
		
	});
});