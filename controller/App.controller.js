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

	return BaseController.extend("lrs.ui5.controller.App",
	{

		onInit : function()
		{
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},

		onAppNav : function(oEvent) {
			var sNav = oEvent.getSource().data("nav");
			oEvent.getSource().addStyleClass("ActiveBackground");
			this.getRouter().navTo(sNav);
		},
		
		_setToggleButtonTooltip : function(bSideExpanded)
		{
			var oToggleButton = this.getView().byId("sideNavigationToggleButton");
			if (bSideExpanded)
			{
				oToggleButton.setTooltip("Large Size Navigation");
			} else
			{
				oToggleButton.setTooltip("Small Size Navigation");
			}
		}

	});
});
