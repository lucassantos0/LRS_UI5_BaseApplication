sap.ui.define([ "lrs/ui5/controller/BaseController" ],
		function(BaseController) {
			"use strict";
			return BaseController.extend("lrs.ui5.controller.ConsumoContratos",
					{
						onInit : function() {
							this.byId("detailPageContratos").setModel(this.getModel("consumoContratos"),"consumoContratos");
						},
						formatterMasterListDate : function(sDate) {
							var str = sDate;
							return str.substring(6, 8) + "/"
									+ str.substring(4, 6) + "/"
									+ str.substring(0, 4);
						},
						formatterMasterListConsumoStatus : function(sConsumo) {
							var iPorcentagem = parseInt(sConsumo);
							if(iPorcentagem < 40) { return 'None'; }
							if(iPorcentagem < 80) { return 'Warning'; }
							return 'Error';
						},
						onSelecionarContrato : function(oEvent){
							var sPath = oEvent.getSource().getBindingContextPath();
							var oModel = this.getModel("consumoContratos").getObject(sPath);
							//sap.m.MessageToast.show("Contrato selecionado: " + oModel.ebeln);
							//this.byId("detailPageContratos").setBindingContext(sPath);
							this.byId("detailPageContratos").bindContext("consumoContratos>" + sPath);
						}
					});
		});