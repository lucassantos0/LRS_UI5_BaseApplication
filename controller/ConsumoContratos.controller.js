sap.ui.define([ "lrs/ui5/controller/BaseController" ],
		function(BaseController) {
			"use strict";
			return BaseController.extend("lrs.ui5.controller.ConsumoContratos",
					{
						onInit : function() {
						//	this.byId("detailPageContratos").setModel(this.getModel("consumoContratos"),"consumoContratos");
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
						
						getSplitContObj : function() {
							var result = this.byId("SplitContainer");
							return result;
						},
						
				        onVoltarDevice: function(){
				        	this.getSplitContObj().to(this.createId("master"));
				        },
				        
						onSelecionarContrato : function(oEvent){
							var sPath = oEvent.getSource().getBindingContextPath();
							var oModel = this.getModel("consumoContratos").getObject(sPath);
							this.byId("detail").bindContext("consumoContratos>" + sPath);
							this.getSplitContObj().to(this.createId("detail"));
						}
					});
		});