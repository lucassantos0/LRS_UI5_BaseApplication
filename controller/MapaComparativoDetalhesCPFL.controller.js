sap.ui.define([ "lrs/ui5/controller/BaseController" ], function(BaseController,
		History) {
	"use strict";
	return BaseController
			.extend("lrs.ui5.controller.MapaComparativoDetalhesCPFL",
					{
						onInit : function() {
							this.getRouter().getRoute("MapaComparativoDetalhesCPFL").attachMatched(this.onRouteMatched, this);
						},
						onRouteMatched : function(oEvent) {
							var sRfq = oEvent.getParameters().arguments.rfq;
							if (!sRfq) {
								return false;
							}
							var oModel = this.getModel("eventosSourcing");
							var oEntry = null;
							for(var nEntry in oModel.getData().eventosSourcing){
								oEntry = oModel.getData().eventosSourcing[nEntry];
								if(oEntry.rfq === sRfq){
									break;
								}
							}
							this.byId("mapaComparativoDetalhesCPFL").bindContext("eventosSourcing>/eventosSourcing/" + nEntry);
						},
						handleTableSelectDialogPress: function(oEvent) {
							if (!this._oDialog) {
								this._oDialog = sap.ui.xmlfragment("lrs.ui5.view.dialogs.MapaComparativoDetalhesFiltro", this);
							}

							this._oDialog.setMultiSelect(true);
							this._oDialog.setRememberSelections(true);

							this.getView().addDependent(this._oDialog);

							// toggle compact style
							jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
							this._oDialog.open();
						},
						handleClose: function(oEvent) {
							var aContexts = oEvent.getParameter("selectedContexts");
							if (aContexts && aContexts.length) {
								MessageToast.show("You have chosen " + aContexts.map(function(oContext) { return oContext.getObject().Name; }).join(", "));
							}
							oEvent.getSource().getBinding("items").filter([]);
						}
					});
});
