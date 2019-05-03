sap.ui.define(
[
		"lrs/ui5/controller/BaseController", "jquery.sap.global", "sap/ui/core/Fragment",
		"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/ResponsivePopover", "sap/m/MessagePopover",
		"sap/m/ActionSheet", "sap/m/Button", "sap/m/Link", "sap/m/Bar", "sap/ui/layout/VerticalLayout",
		"sap/m/NotificationListItem", "sap/m/MessagePopoverItem", "sap/ui/core/CustomData", "sap/m/MessageToast"
], function(BaseController, jQuery, Fragment, Controller, JSONModel, ResponsivePopover, MessagePopover, ActionSheet,
		Button, Link, Bar, VerticalLayout, NotificationListItem, MessagePopoverItem, CustomData, MessageToast)
{
	"use strict";

	return BaseController.extend("lrs.ui5.controller.AribaNews",
	{
		this._newsAribaProcurementURL : "https://cors-anywhere.herokuapp.com/https://blogs.sap.com/tags/73554900100700001921/feed/",
		onInit : function()
		{
			this._newsAribaPageModel = new sap.ui.model.json.JSONModel({ "ProcurementPage" : 1 });
			this.getView().setModel(this._newsAribaPageModel);
		},
		formatterProxyContent : function(sContent) {
			return sContent; //.replace(/https/gi, 'https://cors-anywhere.herokuapp.com/https');
		},
		onPageUp : function(oEvent) {
			var sNav = oEvent.getSource().data("nav"); //selected option - ex. ProcurementPage
			var sPage = this.getView().getModel().getData().ProcurementPage;
			sPage++;
			this.getView().getModel().setData({ "ProcurementPage" : sPage });
		}
		onPageDown : function(oEvent) {
			var sNav = oEvent.getSource().data("nav"); //selected option - ex. ProcurementPage
			var sPage = this.getView().getModel().getData().ProcurementPage;
			sPage--;
			this.getView().getModel().setData({ "ProcurementPage" : sPage });
		}

	});
});
