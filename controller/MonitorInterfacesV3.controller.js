sap.ui.define(
[ 'jquery.sap.global', 'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/m/MessageToast', "lrs/ui5/controller/BaseController", "lrs/ui5/utils/formatter" ], function(
    jQuery, Controller, JSONModel, MessageToast, BaseController, formatter) {
	"use strict";

	return Controller.extend("BaseController",
	{

		formatter: formatter,
		onInit: function () {

		},
		onSearch: function(){
			var aFilters = [];
			var mOperator = sap.ui.model.FilterOperator;
			
			
			var sDateFrom  = this.getView().byId("filtroDataCriacao").getDateValue();
			var sDateTo    = this.getView().byId("filtroDataCriacao").getSecondDateValue();
			var sStatus    = this.getView().byId("filtroStatus").getSelectedKey();
			var sDirection = this.getView().byId("filtroDirecao").getSelectedKey();
			var sType      = this.getView().byId("filtroTipo").getSelectedKey();
			var sProduct   = this.getView().byId("filtroProduto").getSelectedKey();
			var sProcess   = this.getView().byId("filtroProcesso").getSelectedKey();
			var sDocument  = this.getView().byId("filtroDocumento").getValue();
			
			// Date			
			if (sDateFrom || sDateTo){
				if (sDateTo){
					aFilters.push(new sap.ui.model.Filter("Date",
							mOperator.BT, sDateFrom, sDateTo));
				}else{
					aFilters.push(new sap.ui.model.Filter("Date",
							mOperator.EQ, sDateFrom));					
				}
			} 
			
			// Status 
			if (sStatus){
				aFilters.push(new sap.ui.model.Filter("Status",
						mOperator.EQ, sStatus));				
			}
			
			// Direction
			if (sDirection){
				aFilters.push(new sap.ui.model.Filter("Direction",
						mOperator.EQ, sDirection));
			}
			
			// Type
			if (sType){
				aFilters.push(new sap.ui.model.Filter("Type",
						mOperator.EQ, sType));								
			}
			
			// Product
			if (sProduct){
				aFilters.push(new sap.ui.model.Filter("Product",
						mOperator.EQ, sProduct));				
			}
			
			// Process
			if (sProcess){
				aFilters.push(new sap.ui.model.Filter("Process",
						mOperator.EQ, sProcess));				
			}
			
			// Document
			if (sDocument){
				aFilters.push(new sap.ui.model.Filter("Document",
						mOperator.EQ, sDocument));				
			}
			
			this.getView().byId("tableList").getBinding("rows").filter(aFilters);
		}
	});
});