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
			var sId = this.byId("listaRfqs").getBinding("items").oModel.getObject(oEvent.getSource().getBindingContextPath()).Id;
			this.getRouter().navTo("MapaComparativoDetalhesCPFL",{ rfq : sId });
		},
		
		  onSearchAberto : function(oEvent) {
			  var sDocId = this.byId("newDocId").getValue();
			  var oTable = this.byId("listaRfqs");
			  var aFilters = [];
			  if (!!sDocId) {
				  aFilters.push(new sap.ui.model.Filter("NewDocId", sap.ui.model.FilterOperator.EQ, sDocId));
			  }			  
			  if (aFilters.length > 0) {
				  var oFilter = new sap.ui.model.Filter(aFilters, true);
				  oTable.getBinding("items").filter(oFilter);
			  }
		  },		

		  onSearch : function(oEvent) {
			  var sNumRfq = this.byId("filtroNumRfq").getValue();
			  var oPeriodoInicio = new Date(this.byId("filtroDataCriacao").getDateValue());
			  var oPeriodoFim = new Date(this.byId("filtroDataCriacao").getSecondDateValue());
			  var sNumReq = this.byId("filtroNumReq").getValue();
			  var sWsId = this.byId("filtroWsId").getValue();
			  var sDocId = this.byId("filtroDocId").getValue();
			  var oTable = this.byId("listaRfqs");
			  var aFilters = [];
			  if (!!sNumRfq) {
				  aFilters.push(new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, sNumRfq));
			  }
			  if (!!oPeriodoInicio) {
				  aFilters.push(new sap.ui.model.Filter("dateCreation", sap.ui.model.FilterOperator.GE, oPeriodoInicio));
			  }
			  if (!!oPeriodoFim) {
				  aFilters.push(new sap.ui.model.Filter("dateCreation", sap.ui.model.FilterOperator.LE, oPeriodoFim));
			  }
			  if (!!sNumReq) {
				  aFilters.push(new sap.ui.model.Filter("numReq", sap.ui.model.FilterOperator.EQ, sNumReq));
			  }
			  if (!!sWsId) {
				  aFilters.push(new sap.ui.model.Filter("workspace", sap.ui.model.FilterOperator.EQ, sWsId));
			  }
			  if (!!sDocId) {
				  aFilters.push(new sap.ui.model.Filter("docId", sap.ui.model.FilterOperator.EQ, sDocId));
			  }			  
			  if (aFilters.length > 0) {
				  var oFilter = new sap.ui.model.Filter(aFilters, true);
				  oTable.getBinding("items").filter(oFilter);
			  } else {
				  sap.m.MessageToast.show("Nenhum filtro informado!");
    		  }
		  }		
	});
});