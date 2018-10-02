sap.ui.define(
[ "lrs/ui5/controller/BaseController" ], function(BaseController) {
	"use strict";
	return BaseController.extend("lrs.ui5.controller.ConsumoContratos",
	{
	  onInit : function() {
		  // this.byId("detailPageContratos").setModel(this.getModel("consumoContratos"),"consumoContratos");

		  // Set device model
		  var oDeviceModel = new sap.ui.model.json.JSONModel(
		  {
		    isTouch : sap.ui.Device.support.touch,
		    isNoTouch : !sap.ui.Device.support.touch,
		    isPhone : sap.ui.Device.system.phone,
		    isNoPhone : !sap.ui.Device.system.phone,
		    listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
		    listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
		  });
		  this.setModel(oDeviceModel, "device");
		  var oMockJson =
		  {
			  "milk" :
			  [
			  {
			    "Seasons" : "Spring '16",
			    "Revenue" : 325020.45,
			    "Cost" : 197234.4,
			    "Cost1" : 24800.63,
			    "Cost2" : 172433.77,
			    "Target" : 400000.00,
			    "Budget" : 210000.00
			  },
			  {
			    "Seasons" : "Summer '16",
			    "Revenue" : 464000.3,
			    "Cost" : 232070.5,
			    "Cost1" : 51200.39,
			    "Cost2" : 180870.11,
			    "Target" : 400000.00,
			    "Budget" : 224000.00
			  },
			  {
			    "Seasons" : "Autumn '16",
			    "Revenue" : 479100.17,
			    "Cost" : 231003.32,
			    "Cost1" : 79200.54,
			    "Cost2" : 151802.78,
			    "Target" : 440000.00,
			    "Budget" : 238000.00
			  },
			  {
			    "Seasons" : "Winter '16",
			    "Revenue" : 536110.34,
			    "Cost" : 371122.45,
			    "Cost1" : 108800.73,
			    "Cost2" : 262321.72,
			    "Target" : 440000.00,
			    "Budget" : 252000.00
			  } ]
		  };
		  this._oMockModel = new sap.ui.model.json.JSONModel(oMockJson);
		  this.setModel(this._oMockModel, "chart");
	  },
	  formatterMasterListDate : function(sDate) {
		  var str = sDate;
		  return str.substring(6, 8) + "/" + str.substring(4, 6) + "/" + str.substring(0, 4);
	  },
	  formatterMasterListConsumoStatus : function(sConsumo) {
		  var iPorcentagem = parseInt(sConsumo);
		  if (iPorcentagem < 40) { return 'None'; }
		  if (iPorcentagem < 80) { return 'Warning'; }
		  return 'Error';
	  },

	  getSplitContObj : function() {
		  var result = this.byId("SplitContainer");
		  return result;
	  },

	  onVoltarDevice : function() {
		  this.getSplitContObj().to(this.createId("master"));
	  },

	  onSelecionarContrato : function(oEvent) {
		  var sPath = oEvent.getSource().getBindingContextPath();
		  var oModel = this.getModel("consumoContratos").getObject(sPath);
		  this.byId("detail").bindContext("consumoContratos>" + sPath);
		  this.getSplitContObj().to(this.createId("detail"));
	  },
	  createPopover : function() {
		  if (this._oQuickViewSupplier) {
			  this._oQuickViewSupplier.destroy();
		  }

		  this._oQuickViewSupplier = sap.ui.xmlfragment("lrs.ui5.view.ConsumoContratos.SupplierQuickCard", this);
		  this.getView().addDependent(this._oQuickViewSupplier);
	  },
	  openQuickViewSupplier : function(oEvent, sPath) {
		  this.createPopover();
		  this._oQuickViewSupplier.bindContext("consumoContratos>" + sPath);
		  var oButton = oEvent.getSource();
		  jQuery.sap.delayedCall(0, this, function() {
			  this._oQuickViewSupplier.openBy(oButton);
		  });
	  },
	  viewSupplierDetails : function(oEvent) {
		  var bindingContextPath = oEvent.getSource().getBindingContext("consumoContratos").sPath;
		  this.openQuickViewSupplier(oEvent, bindingContextPath);
	  },
	  viewDashboardFilterSelect : function(oEvent) {
		  if (this._oDashboardFilterSelectDialog) {
			  this._oDashboardFilterSelectDialog.destroy();
		  }
		  this._oDashboardFilterSelectDialog = sap.ui.xmlfragment("lrs.ui5.view.ConsumoContratos.DashboardFilterSelect", this);
		  this.getView().addDependent(this._oDashboardFilterSelectDialog);
		  this._oDashboardFilterSelectDialog.open();
	  }
	});
});