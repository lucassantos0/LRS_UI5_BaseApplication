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
			    "Material" : "Material 1",
			    "Fornecedor" : "1000",
			    "Consumo" : "99"
			  },
			  {
			    "Material" : "Material 2",
			    "Fornecedor" : "1010",
			    "Consumo" : "80"
			  },
			  {
			    "Material" : "Material 3",
			    "Fornecedor" : "1010",
			    "Consumo" : "70"
			  },
			  {
			    "Material" : "Material 4",
			    "Fornecedor" : "1000",
			    "Consumo" : "70"
			  },
			  {
			    "Material" : "Material 5",
			    "Fornecedor" : "999",
			    "Consumo" : "38"
			  },
			  {
			    "Material" : "Material 6",
			    "Fornecedor" : "1010",
			    "Consumo" : "12"
			  } ]
		  };
		  this._oMockModel = new sap.ui.model.json.JSONModel(oMockJson);
		  this.setModel(this._oMockModel, "chart");

	  },
	  formatterMasterListDate : function(sDate) {
		  var str = sDate;
		  try {
			  return str.substring(6, 8) + "/" + str.substring(4, 6) + "/" + str.substring(0, 4);
		  } catch (ex) {
			  return null;
		  }
	  },
	  formatterMasterListConsumoStatus : function(sConsumo) {
		  var iPorcentagem = parseInt(sConsumo);
		  if (iPorcentagem < 40) { return 'None'; }
		  if (iPorcentagem < 80) { return 'Warning'; }
		  return 'Error';
	  },

	  formatterGetTopConsumption : function(aEkpo) {
		  var iMax = 0;
		  var nCalc = 0;
		  var oEkpo = null;
		  for ( var iEkpo in aEkpo) {
			  oEkpo = aEkpo[iEkpo];
			  nCalc = (oEkpo.menge / oEkpo.ktmng) * 100;
			  if (nCalc > iMax) {
				  iMax = nCalc;
			  }
		  }
		  return (Math.round(iMax * 100) / 100) + "%";
	  },

	  formatterGetTopConsumptionStatus : function(aEkpo) {
		  var iMax = 0;
		  var nCalc = 0;
		  var oEkpo = null;
		  for ( var iEkpo in aEkpo) {
			  oEkpo = aEkpo[iEkpo];
			  nCalc = (oEkpo.menge / oEkpo.ktmng) * 100;
			  if (nCalc > iMax) {
				  iMax = nCalc;
			  }
		  }
		  if (iMax < 70) { return "None"; }
		  if (iMax < 85) {
			  return "Warning";
		  } else {
			  return "Error";
		  }
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

	  onFilterSettings : function() {
		  if (this._oFilterSettingsDialog) {
			  this._oFilterSettingsDialog.destroy();
		  }
		  this._oFilterSettingsDialog = sap.ui.xmlfragment("lrs.ui5.view.ConsumoContratos.FilterSettings", this);
		  this.getView().addDependent(this._oFilterSettingsDialog);
		  this._oFilterSettingsDialog.open();
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