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
		  this._oQuickViewSupplier.setBindingContext("consumoContratos>" + sPath);
		  var oButton = oEvent.getSource();
		  jQuery.sap.delayedCall(0, this, function() {
			  this._oQuickViewSupplier.openBy(oButton);
		  });
	  },
	  viewSupplierDetails : function(oEvent) {
	  	var bindingContextPath = oEvent.getSource().getBindingContext("consumoContratos").sPath;
		  this.openQuickViewSupplier(oEvent, sPath );
	  }
	});
});