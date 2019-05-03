sap.ui.define(
[ "lrs/ui5/controller/BaseController", "jquery.sap.global", "sap/ui/core/Fragment", "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel",
    "sap/m/ResponsivePopover", "sap/m/MessagePopover", "sap/m/ActionSheet", "sap/m/Button", "sap/m/Link", "sap/m/Bar", "sap/ui/layout/VerticalLayout",
    "sap/m/NotificationListItem", "sap/m/MessagePopoverItem", "sap/ui/core/CustomData", "sap/m/MessageToast" ], function(BaseController, jQuery, Fragment,
    Controller, JSONModel, ResponsivePopover, MessagePopover, ActionSheet, Button, Link, Bar, VerticalLayout, NotificationListItem, MessagePopoverItem,
    CustomData, MessageToast) {
	"use strict";

	return BaseController.extend("lrs.ui5.controller.AribaNews",
	{
	  onInit : function() {
		  this._newsURLs =
		  {
		    "newsAribaProcurement" : "https://cors-anywhere.herokuapp.com/https://blogs.sap.com/tags/73554900100700001921/feed/",
		    "newsAribaSupplyChain" : "https://cors-anywhere.herokuapp.com/https://blogs.sap.com/tags/73554900100700001931/feed/",
		    "newsAribaCIG" : "https://cors-anywhere.herokuapp.com/https://blogs.sap.com/tags/73554900100800000194/feed/",
		    "newsSAPCloudPlatform" : "https://cors-anywhere.herokuapp.com/https://blogs.sap.com/tags/01200615320800003694/feed/",
		    "newsAribaNetworkIntegration" : "https://cors-anywhere.herokuapp.com/https://blogs.sap.com/tags/67838200100800006082/feed/",
		    "newsAribaNetwork" : "https://cors-anywhere.herokuapp.com/https://blogs.sap.com/tags/67838200100800005701/feed/",
		    "newsAribaStrategicSourcing" : "https://cors-anywhere.herokuapp.com/https://blogs.sap.com/tags/73554900100700001349/feed/"
		  };
		  this._newsAribaPageModel = new sap.ui.model.json.JSONModel(
		  {
		    "newsAribaProcurement" : 1,
		    "newsAribaSupplyChain" : 1,
		    "newsAribaCIG" : 1,
		    "newsSAPCloudPlatform" : 1,
		    "newsAribaNetworkIntegration" : 1,
		    "newsAribaNetwork" : 1,
		    "newsAribaStrategicSourcing" : 1
		  });
		  this.getView().setModel(this._newsAribaPageModel);
	  },
	  formatterProxyContent : function(sContent) {
		  return sContent; 
	  },
	  onPageUp : function(oEvent) {
		  var sNav = oEvent.getSource().data("nav");
		  var oModel = this.getView().getModel().getData();
		  oModel[sNav]++;
		  this.getView().getModel(sNav).loadData(this._newsURLs[sNav] + "?paged=" + oModel[sNav]);
		  this.getView().getModel().setData(oModel);
	  },
	  onPageDown : function(oEvent) {
		  var sNav = oEvent.getSource().data("nav");
		  var oModel = this.getView().getModel().getData();
		  oModel[sNav]--;
		  this.getView().getModel(sNav).loadData(this._newsURLs[sNav] + "?paged=" + oModel[sNav]);
		  this.getView().getModel().setData(oModel);
	  }

	});
});
