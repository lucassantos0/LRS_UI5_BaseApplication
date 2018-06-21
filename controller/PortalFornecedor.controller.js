sap.ui.define(
[
	"lrs/ui5/controller/BaseController"
], function(BaseController)
{
	"use strict";
	return BaseController.extend("lrs.ui5.controller.PortalFornecedores",
	{
		onInit : function(){
			
		},
		onPreviaPress: function(){
			this.getRouter().navTo("Previas");
		}
	});
});