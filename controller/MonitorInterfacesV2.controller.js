sap.ui.define(
[ 'jquery.sap.global', 'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/m/MessageToast', "lrs/ui5/controller/BaseController" ], function(
    jQuery, Controller, JSONModel, MessageToast, BaseController) {
	"use strict";

	return Controller.extend("BaseController",
	{
	  onInit : function() {
		 // var oDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowMultipleRootNodes", "/ProcessFlowNodes.json");
		 // var oModel = new JSONModel(oDataPath);

		  this.oProcessFlow = this.getView().byId("processflow");
		 // oModel.attachRequestCompleted(this.oProcessFlow.updateModel.bind(this.oProcessFlow));

		  //this.getView().setModel(oModel);
		  //this.oProcessFlow.optimizeLayout(true);
	  },

	  onHighlightPath : function(oEvent) {
//		  var sDataPath;
//		  var oModel = this.oProcessFlow.getModel();
//		  if (oEvent.getParameter("pressed")) {
//			  sDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowMultipleRootNodes", "/ProcessFlowNodesHighlighted.json");
//			  MessageToast.show("Path has been highlighted");
//		  } else {
//			  sDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowMultipleRootNodes", "/ProcessFlowNodes.json");
//			  MessageToast.show("Path highlighting has been reset.");
//		  }
//		  oModel.loadData(sDataPath);
	  },

	 onOptimizeLayout : function(oEvent) {
		 this.oProcessFlow.optimizeLayout(true);
		  //this.oProcessFlow.optimizeLayout(oEvent.getSource().getPressed());
		  //MessageToast.show("Layout was " + (oEvent.getSource().getPressed() ? "optimized." : "brought back to its initial state."));
	  }, 

	  onZoomIn : function() {
		  this.oProcessFlow.zoomIn();

		  MessageToast.show("Zoom level changed to: " + this.oProcessFlow.getZoomLevel());
	  },

	  onZoomOut : function() {
		  this.oProcessFlow.zoomOut();

		  MessageToast.show("Zoom level changed to: " + this.oProcessFlow.getZoomLevel());
	  },
	  onDocumentPressShowDetails : function(oEvent) {
	  	//var oModel = this.getView().getModel("fluxoDocumentos").getObject(oEvent.getParameter("oBindingContexts").fluxoDocumentos.sPath);
	  	//sap.m.MessageToast.show("Exibir detalhes do documento "+ oModel.id + " do tipo "+ oModel.lane);
	  	
	  	if (!this._oPopoverDetalhesDocumento) {
				this._oPopoverDetalhesDocumento = sap.ui.xmlfragment("lrs.ui5.view.MonitorInterfacesV2.DetalhesDocumento", this);
				this.getView().addDependent(this._oPopoverDetalhesDocumento);
			}
	  	this._oPopoverDetalhesDocumento.bindElement("fluxoDocumentos>"+oEvent.getParameter("oBindingContexts").fluxoDocumentos.sPath);
			this._oPopoverDetalhesDocumento.openBy(oEvent.getSource());
	  	
	  },
	  onCloseDetalhesDocumento: function (oEvent) {
			this._oPopoverDetalhesDocumento.close();
		}
	});
});
