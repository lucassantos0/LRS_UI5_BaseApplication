sap.ui.define(
[
	"lrs/ui5/controller/BaseController"
], function(BaseController)
{
	"use strict";
	return BaseController.extend("lrs.ui5.controller.Previas",
	{
		onInit : function(){
			//this.byId("detailPageEmbarques").setModel(this.getModel("embarquesFornecedor"),"embarquesFornecedor");
            // Set device model
            var oDeviceModel = new sap.ui.model.json.JSONModel({
	            isTouch: sap.ui.Device.support.touch,
	            isNoTouch: !sap.ui.Device.support.touch,
	            isPhone: sap.ui.Device.system.phone,
	            isNoPhone: !sap.ui.Device.system.phone,
	            listMode: sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
	            listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive"
            });		
            this.setModel(oDeviceModel, "device");
            
		},
		formatterMasterListDate : function(sDate) {
			var str = sDate;
			return str.substring(6, 8) + "/"
					+ str.substring(4, 6) + "/"
					+ str.substring(0, 4);
		},
		
		getSplitContObj : function() {
			var result = this.byId("SplitContainer");
			return result;
		},
		
        onVoltarDevice: function(){
        	this.getSplitContObj().to(this.createId("master"));
        },
        
		onSelecionarEmbarque : function(oEvent){
			var sPath = oEvent.getSource().getBindingContextPath();
			var oModel = this.getModel("embarquesFornecedor").getObject(sPath);
			this.byId("detail").bindContext("embarquesFornecedor>" + sPath);
			this.getSplitContObj().to(this.createId("detail"));
		}		
	});
});