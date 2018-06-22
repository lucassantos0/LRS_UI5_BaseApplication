sap.ui.define(
[
	"lrs/ui5/controller/BaseController"
], function(BaseController)
{
	"use strict";
	return BaseController.extend("lrs.ui5.controller.Previas",
	{
		onInit : function(){
			this.byId("detailPageEmbarques").setModel(this.getModel("embarquesFornecedor"),"embarquesFornecedor");
		},
		formatterMasterListDate : function(sDate) {
			var str = sDate;
			return str.substring(6, 8) + "/"
					+ str.substring(4, 6) + "/"
					+ str.substring(0, 4);
		},
		onSelecionarEmbarque : function(oEvent){
			var sPath = oEvent.getSource().getBindingContextPath();
			var oModel = this.getModel("embarquesFornecedor").getObject(sPath);
			this.byId("detailPageEmbarques").bindContext("embarquesFornecedor>" + sPath);
		}		
	});
});