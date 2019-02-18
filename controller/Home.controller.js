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
		navToMonitorInterfacesV2 : function()
		{
			this.getRouter().navTo("MonitorInterfacesV2");
		},
		navToLogInterfaces : function(){
			this.getRouter().navTo("LogInterfaces");
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