sap.ui.define(
[ "lrs/ui5/controller/BaseController", 'sap/ui/model/json/JSONModel', "lrs/ui5/controller/formatter", "sap/m/MessageBox",
    "sap/ui/core/Fragment", "sap/m/Dialog", "sap/m/Label", "sap/m/Text" ], function(BaseController, JSONModel, formatter, MessageBox, Fragment, Dialog, Label,
    Text) {
	"use strict";
	return BaseController.extend("lrs.ui5.controller.Mapa",
	{
	  formatter : formatter,
	  onInit : function() {
		  this.getRouter().getRoute("mapa").attachMatched(this.onRouteMatched, this);
		  this._oControlModelData =
		  {
			  "AnaliseItem" :
			  {
			    "UltimoPrecoVisivel" : false,
			    "Exibicao" : 0,
			    "AwardedPrice" : 0,
			    "AwardedItems" : 0,
			    "IndiceIGPM" : 0,
			    "LastPOPriceSum" : 0,
			    "CommonAwardedPrice" : 0,
			    "CommonAwardedItems" : 0,
			    "NotCommonAwardedPrice" : 0,
			    "NotCommonAwardedItems" : 0
			  }
		  };
		  this._oControlModel = new sap.ui.model.json.JSONModel(this._oControlModelData);
		  this.getView().setModel(this._oControlModel, "Control");
	  },
	  onRouteMatched : function(oEvent) {
		  this.sDocument = oEvent.getParameters().arguments.rfq;
		  if (!this.sDocument) {
			  return false;
		  } else {
			  this.LoadRFPData(this.sDocument);
		  }
	  },
	  LoadRFPData : function(sDocument) {
		  this.getView().getModel("mcdetails").attachRequestFailed(this.onmcdetailsModelLoadFailed.bind(this));
		  this.getView().getModel("mcdetails").attachRequestSent(this.onmcdetailsModelLoadSent.bind(this));
		  this.getView().getModel("mcdetails").attachRequestCompleted(this.onmcdetailsModelLoadCompleted.bind(this));
		  this.sDocument = sDocument;
		  this.getView().getModel("mcdetails").loadData("/sap/bc/zmapa001?rfq=" + sDocument);
	  },
	  HeaderChangeDocument : function(oEvent) {
		  var dialog = new Dialog(
		  {
		    title : 'Buscar RFP',
		    type : 'Message',
		    content :
		    [ new Label(
		    {
		      text : 'Informar código documento (formato DocXXXX) para consulta.',
		      labelFor : 'submitDialogTextarea'
		    }), new sap.m.TextArea('submitDialogTextarea',
		    {
		      liveChange : function(oEvent) {
			      var sText = oEvent.getParameter('value');
			      var parent = oEvent.getSource().getParent();

			      parent.getBeginButton().setEnabled(sText.length > 3);
		      },
		      width : '100%',
		      placeholder : 'Doc123456789'
		    }) ],
		    beginButton : new sap.m.Button(
		    {
		      text : 'Buscar',
		      enabled : false,
		      press : function() {
			      var sDocument = sap.ui.getCore().byId('submitDialogTextarea').getValue();
			      this.LoadRFPData(sDocument);
			      dialog.close();
		      }.bind(this)
		    }),
		    endButton : new sap.m.Button(
		    {
		      text : 'Cancelar',
		      press : function() {
			      dialog.close();
		      }
		    }),
		    afterClose : function() {
			    dialog.destroy();
		    }
		  });

		  dialog.open();
	  },
	  onmcdetailsModelLoadFailed : function(oEvent) {
		  this.byId("mainPagePriceComparison").setBusy(false);
	  },
	  onmcdetailsModelLoadSent : function(oEvent) {
		  this.byId("mainPagePriceComparison").setBusy(true);
	  },
	  onmcdetailsModelLoadCompleted : function(oEvent) {
		  this.byId("mainPagePriceComparison").setBusy(false);
		  if (!oEvent.getParameter("success")) {
			  MessageBox.error(oEvent.getParameter("errorobject").responseText,
			  {
			    icon : "sap-icon://message-error",
			    title : "Erro na consulta RFQ " + this.sRfq
			  });
		  } else {
			  // SUCESSO
			  this.sRfq = this.sDocument;
			  this.updateTabelaConfiguracaoFornecedores();
		  }
	  },
	  FormatCurrency: function(amount) {
	    var oCurrency = new sap.ui.model.type.Currency({
	    		decimalSeparator : ',', 
	    		groupingSeparator : '.',
	        showMeasure: false       
	    });
	    return oCurrency.formatValue([amount,"BRL"], "string");
	  },
	  AnaliseItemColFactory : function(sId, oContext) {
		  var sColumnId = oContext.getObject().label;
		  var multiLabels = [];
		  if (!!oContext.getObject().labelHeader) {
			  multiLabels.push(new sap.m.Label(
			  {
			    text : oContext.getObject().labelHeader,
			    design : "Bold"
			  }));
		  }
		  multiLabels.push(new sap.m.Label(
		  {
		    text : sColumnId,
		    design : "Bold"
		  }));
		  var oColumnObject = null;
		  if (oContext.getObject().template.href) {
			  // Create link at screen
			  oColumnObject = new sap.m.Link(
			  {
			    text : oContext.getObject().template.text,
			    href : oContext.getObject().template.href,
			    target : oContext.getObject().template.target
			  });
		  } else if (oContext.getObject().template.state) {
			  // Check if should create object status - best bidder price
			  oColumnObject = new sap.m.ObjectStatus(
			  {
			    text : oContext.getObject().template.text,
			    state : oContext.getObject().template.state,
			    icon : oContext.getObject().template.stateicon
			  });
		  } else {
			  oColumnObject = new sap.m.Text(
			  {
				  text : oContext.getObject().template.text
			  });
		  }

		  var oColumn = new sap.ui.table.Column(
		  {
		    headerSpan : oContext.getObject().headerSpan,
		    hAlign : oContext.getObject().hAlign != "" ? oContext.getObject().hAlign : "Begin",
		    multiLabels : multiLabels,
		    resizable : false,
		    width : oContext.getObject().minWidth,
		    visible : oContext.getObject().visible,
		    template : oColumnObject
		  });

		  return oColumn;
	  },
	  ValorUltimoPrecoCorrigido : function(nLastPOPricesSum, nIndiceIGPM){
	  	if(!nLastPOPricesSum){ return ""; }
	  	if(nIndiceIGPM === 0 || !nIndiceIGPM){
	  		return this.FormatCurrency((nLastPOPricesSum).toFixed(2));
	  	}
	  	return this.FormatCurrency((nLastPOPricesSum + (nLastPOPricesSum * ( nIndiceIGPM / 100 ) )).toFixed(2)) ;
	  },
	  ValorCorrigidoUltPrecoSomatorio : function(nLastPOPriceSum, nIndex){
	  	if(!nIndex){
	  		nIndex = 0;
	  	}
	  	return this.FormatCurrency((nLastPOPriceSum + (nLastPOPriceSum * ( nIndex / 100 ) )).toFixed(2));
	  },
	  ValorCorrigidoUltPrecoSomatorioDiff : function(nSomatorioRfp, nLastPOPriceSum, nIndex){
	  	if(!nLastPOPriceSum){
	  		return "";
	  	}
	  	var nFixedIndexValue = nLastPOPriceSum + (nLastPOPriceSum * ( nIndex / 100 ) );
	  	if(nFixedIndexValue === 0){
	  		return "0";
	  	}
	  	return nFixedIndexValue > nSomatorioRfp ?
	  			Math.round(( ( nFixedIndexValue - nSomatorioRfp ) / nSomatorioRfp ) * 100) : 
	  				Math.round(( ( nSomatorioRfp - nFixedIndexValue ) / nFixedIndexValue ) * 100) * -1;
	  },
	  ValorCorrigidoUltPrecoSomatorioDiffState : function(nSomatorioRfp, nLastPOPriceSum, nIndex){
	  	var nFixedIndexValue = nLastPOPriceSum + (nLastPOPriceSum * ( nIndex / 100 ) );
	  	return nFixedIndexValue > nSomatorioRfp ? "Success" : "Error";
	  },
	  MessagesShow : function(oEvent) {
		  if (!this._oDialog) {
			  // create dialog via fragment factory
			  this._oDialog = sap.ui.xmlfragment("fragmentMapaLogMensagens", "mapacomparativo.view.Mapa.MapaLogMensagens", this);
			  // connect dialog to view (models, lifecycle)
			  this.getView().addDependent(this._oDialog);
			  this._oDialog.setModel(this.getView().getModel("mcdetails"), "mcdetails");
		  }
		  this._oDialog.bindElement("mcdetails>" + oEvent.getSource().getParent().getBindingContextPath());
		  this._oDialog.open();
	  },
	  MessagesClose : function() {
		  this._oDialog.close();
	  },
	  MessageButtonIcon : function(sMessage) {
		  if (!sMessage) { return null; }
		  if (sMessage === "Error") {
			  return "sap-icon://message-error";
		  } else if (sMessage === "Warning") {
			  return "sap-icon://message-warning";
		  } else if (sMessage === "Information") { return ""; }
	  },
	  MessageButtonColor : function(sMessage) {
		  if (!sMessage) { return null; }
		  if (sMessage === "Error") {
			  return "red";
		  } else if (sMessage === "Warning") {
			  return "yellow";
		  } else if (sMessage === "Information") { return ""; }
	  },
	  MessagesButtonIcon : function(aMessages) {
		  var bWarning = false;
		  if (!aMessages) { return null; }
		  for (var i = 0; i < aMessages.length; i++) {
			  if (aMessages[i].type === "Error") { return "sap-icon://message-error"; }
			  if (aMessages[i].type === "Warning") {
				  bWarning = true;
			  }
		  }
		  return bWarning ? "sap-icon://message-warning" : "sap-icon://message-success";
	  },
	  MessagesButtonColor : function(aMessages) {
		  var bWarning = false;
		  if (!aMessages) { return null; }
		  for (var i = 0; i < aMessages.length; i++) {
			  if (aMessages[i].type === "Error") { return "Reject"; }
		  }
		  return "Default";
		  // return bWarning ? "yellow" : "green";
	  },

	  MessagesButtonVisible : function(aMessages) {
		  if (!aMessages) { return false; }
		  return aMessages.length > 0;
	  },
	  TabelaConfiguracaoFornecedoresNome : function(sId, sNome) {
		  return sId == sNome ? sId : sId + " " + sNome;
	  },
	  updateDiffItems : function() {
	  	// hasdiffitem = true (tem divergencias em pelo menos uma oferta)
	  	// hasdiffitem = false (todos os bids estão OK)
	  	var aItems = this.getView().getModel("mcdetails").getObject("/items");
		  var aSuppliers = this.getView().getModel("mcdetails").getObject("/suppliers");
		  var aSuppliersCalc = [];
		  var bHasdiff = false;
		  for (var i = 0; i < aSuppliers.length; i++) 
		  {
			  aSuppliersCalc[aSuppliers[i].id] = {
				    applyCalc : aSuppliers[i].applyCalc
				  };
		  }
		  for(var i = 0 ; i < aItems.length ; i ++ ){
		  	bHasdiff = false;
		  	for(var j = 0; j < aItems[i].bids.length; j ++ ){
		  		if(!!aSuppliersCalc[aItems[i].bids[j].supplier]){
			  		if(!!aSuppliersCalc[aItems[i].bids[j].supplier].applyCalc && !!aItems[i].bids[j].hasdiff){
			  			bHasdiff = true;
			  		}
		  		}
		  	}
		  	this.getView().getModel("mcdetails").setProperty("/items/" + i + "/hasdiffitem", bHasdiff);
		  }
	  },
	  
	  updateCommonItems : function() {
	  	// allbiddersitem = 1 (itens comuns)
	  	// allbiddersitem = 2 (itens nao comuns)
	  	var aItems = this.getView().getModel("mcdetails").getObject("/items");
		  var aSuppliers = this.getView().getModel("mcdetails").getObject("/suppliers");
		  var commonMap;
		  var aSuppliersCommon = [];
		  var aSuppliersNotCommon = [];
		  var nTempItemBidPrice;
		  var sTempItemBidSupplier;
		  var nSumCommonPrice = 0;
		  var nSumCommonItems = 0;
		  var nSumNotCommonPrice = 0;
		  var nSumNotCommonItems = 0;
		  for (var i = 0; i < aSuppliers.length; i++) 
		  {
			  aSuppliersCommon[aSuppliers[i].id] = {
				    applyCalc : aSuppliers[i].applyCalc,
				    quoteprice : 0,
				    quoteitems : 0,
				    awardeditems : 0,
				    awardedprice : 0,
						distawarditems : 0,
						distawardprice : 0,
				  };
			  aSuppliersNotCommon[aSuppliers[i].id] = {
				    applyCalc : aSuppliers[i].applyCalc,
				    quoteprice : 0,
				    quoteitems : 0,
				    awardeditems : 0,
				    awardedprice : 0,
						distawarditems : 0,
						distawardprice : 0,
				  };
		  }
		  for(var i = 0; i < aItems.length; i++){
		  	nTempItemBidPrice = 0;
		  	sTempItemBidSupplier = "";
  			for(var j = 0; j < aItems[i].bids.length; j++){
  				if(!aItems[i].bids[j].supplier){
  					continue;
  				}
  				if(!aSuppliersCommon[aItems[i].bids[j].supplier].applyCalc){
  		  		continue;
  		  	}
  				
			  	if (nTempItemBidPrice == 0) {
					  nTempItemBidPrice = aItems[i].bids[j].bidprice;
					  sTempItemBidSupplier = aItems[i].bids[j].supplier;
				  } else if (nTempItemBidPrice > aItems[i].bids[j].bidprice) {
					  nTempItemBidPrice = aItems[i].bids[j].bidprice;
					  sTempItemBidSupplier = aItems[i].bids[j].supplier;
				  }

			  	switch(aItems[i].allbiddersitem){
			  		case "1": // itens comuns
			  				aSuppliersCommon[aItems[i].bids[j].supplier].quoteitems ++;
			  				aSuppliersCommon[aItems[i].bids[j].supplier].quoteprice += aItems[i].bids[j].bidprice * aItems[i].quantity;
			  				break;
			  		case "2": // itens não comuns
			  				aSuppliersNotCommon[aItems[i].bids[j].supplier].quoteitems ++;
			  				aSuppliersNotCommon[aItems[i].bids[j].supplier].quoteprice += aItems[i].bids[j].bidprice * aItems[i].quantity;
				  			break;
			  	}
  			}
		  	switch(aItems[i].allbiddersitem){
		  		case "1": // itens comuns
	  				nSumCommonItems ++;
		  			if (!!sTempItemBidSupplier) {
		  				aSuppliersCommon[sTempItemBidSupplier].awardeditems ++;
		  				aSuppliersCommon[sTempItemBidSupplier].awardedprice += (nTempItemBidPrice * aItems[i].quantity);
		  				nSumCommonPrice += (nTempItemBidPrice * aItems[i].quantity);
		  			}
					  break;
		  		case "2": // itens não comuns
	  				nSumNotCommonItems ++;
		  			if (!!sTempItemBidSupplier) {
		  				aSuppliersNotCommon[sTempItemBidSupplier].awardeditems ++;
		  				aSuppliersNotCommon[sTempItemBidSupplier].awardedprice += (nTempItemBidPrice * aItems[i].quantity);
		  				nSumNotCommonPrice += (nTempItemBidPrice * aItems[i].quantity);
		  			}
		  			break;
		  	}
		  }
		  for (var i = 0; i < aSuppliers.length; i++) 
		  {
		  	this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/common/awardeditems", aSuppliersCommon[aSuppliers[i].id].awardeditems);
		  	this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/common/awardedprice", aSuppliersCommon[aSuppliers[i].id].awardedprice);
		  	this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/common/quoteitems", aSuppliersCommon[aSuppliers[i].id].quoteitems);
		  	this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/common/quoteprice", aSuppliersCommon[aSuppliers[i].id].quoteprice);
		  	this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/common/distawarditems", 
		  			nSumCommonItems > 0 ? Math.round((aSuppliersCommon[aSuppliers[i].id].awardeditems / nSumCommonItems) * 100) : 0);
		  	this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/common/distawardprice", 
		  			nSumCommonPrice > 0 ? Math.round((aSuppliersCommon[aSuppliers[i].id].awardedprice / nSumCommonPrice) * 100) : 0);
		  	
		  	this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/notcommon/awardeditems", aSuppliersNotCommon[aSuppliers[i].id].awardeditems);
		  	this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/notcommon/awardedprice", aSuppliersNotCommon[aSuppliers[i].id].awardedprice);
		  	this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/notcommon/quoteitems", aSuppliersNotCommon[aSuppliers[i].id].quoteitems);
		  	this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/notcommon/quoteprice", aSuppliersNotCommon[aSuppliers[i].id].quoteprice);
		  	this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/notcommon/distawarditems", 
		  			nSumNotCommonItems > 0 ? Math.round((aSuppliersNotCommon[aSuppliers[i].id].awardeditems / nSumNotCommonItems) * 100) : 0);
		  	this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/notcommon/distawardprice", 
		  			nSumNotCommonPrice > 0 ? Math.round((aSuppliersNotCommon[aSuppliers[i].id].awardedprice / nSumNotCommonPrice) * 100) : 0);
		  }
		  this.getView().getModel("Control").setProperty("/AnaliseItem/CommonAwardedPrice", nSumCommonPrice );
		  this.getView().getModel("Control").setProperty("/AnaliseItem/CommonAwardedItems", nSumCommonItems );
		  this.getView().getModel("Control").setProperty("/AnaliseItem/NotCommonAwardedPrice", nSumNotCommonPrice );
		  this.getView().getModel("Control").setProperty("/AnaliseItem/NotCommonAwardedItems", nSumNotCommonItems );
	  },
	  updateTabelaConfiguracaoFornecedores : function(oSelected) {
		  var aItems = this.getView().getModel("mcdetails").getObject("/items");
		  var aSuppliers = this.getView().getModel("mcdetails").getObject("/suppliers");
		  var bSupplierCalcEnabled;
		  var aSuppliersCalc = [];
		  var nRemoveApplyCalc = 0;
		  var bCommonItem = false;
		  var nSuppliersWithCalc = 0;
		  var nTempItemBidPrice;
		  var sTempItemBidSupplier;
		  var nSumAllItemsPrice = 0;
		  var nSumAllItemsAwarded = 0;
		  var nSumAllItemsLastPOPriceSum = 0;
		  var oSuppliersSumCalc =
		  {
		    nSumAwarded : 0,
		    nSumPrice : 0
		  };
		  var map;
		  for (var i = 0; i < aSuppliers.length; i++) {
			  if (aSuppliers[i].applyCalc) {
				  nSuppliersWithCalc++;
			  }
			  map =
			  {
			    applyCalc : aSuppliers[i].applyCalc,
			    awarded : 0,
			    quoteprice : 0,
			    exclusive : 0,
			    lastpopricesum : 0,
			    lastpopricesumquoteaward : 0
			  };
			  aSuppliersCalc[aSuppliers[i].id] = map;
		  }

		  for (var i = 0; i < aItems.length; i++) {
			  sTempItemBidSupplier = "";
			  nTempItemBidPrice = 0;
			  nRemoveApplyCalc = 0;
			  var nTotalBids = 0;
			  for (var j = 0; j < aItems[i].bids.length; j++) {

				  if (aItems[i].bids[j].bidprice == 0 || !aSuppliersCalc[aItems[i].bids[j].supplier].applyCalc) {
					  nRemoveApplyCalc++;
					  continue;
				  }
				  
				  if(!!aItems[i].lastpoprice){
				  	aSuppliersCalc[aItems[i].bids[j].supplier].lastpopricesum += aItems[i].lastpoprice * aItems[i].quantity;
				  }else{
				  	aSuppliersCalc[aItems[i].bids[j].supplier].lastpopricesum += !!aItems[i].bids[j].bidprice ? aItems[i].bids[j].bidprice * aItems[i].quantity : 0 ;
				  }
				  
				  if (nTempItemBidPrice == 0) {
					  nTempItemBidPrice = aItems[i].bids[j].bidprice;
					  sTempItemBidSupplier = aItems[i].bids[j].supplier;
				  } else if (nTempItemBidPrice > aItems[i].bids[j].bidprice) {
					  nTempItemBidPrice = aItems[i].bids[j].bidprice;
					  sTempItemBidSupplier = aItems[i].bids[j].supplier;
				  }
				  if (aItems[i].bids[j].bidprice > 0) {
					  nTotalBids++;
				  }
			  }
			  if (!!sTempItemBidSupplier) {
				  aSuppliersCalc[sTempItemBidSupplier].awarded++;
				  aSuppliersCalc[sTempItemBidSupplier].quoteprice = aSuppliersCalc[sTempItemBidSupplier].quoteprice + (nTempItemBidPrice * aItems[i].quantity);
if(!aItems[i].lastpoprice && !aItems[i].averageprice){
				  	
				  }else if(!aItems[i].averageprice){
				  	aSuppliersCalc[sTempItemBidSupplier].lastpopricesumquoteaward = aSuppliersCalc[sTempItemBidSupplier].lastpopricesumquoteaward + (aItems[i].lastpoprice * aItems[i].quantity) ;
				  }else{
				  	aSuppliersCalc[sTempItemBidSupplier].lastpopricesumquoteaward = aSuppliersCalc[sTempItemBidSupplier].lastpopricesumquoteaward + (aItems[i].averageprice * aItems[i].quantity) ;
				  }
				  oSuppliersSumCalc.nSumPrice += nTempItemBidPrice * aItems[i].quantity;
				  oSuppliersSumCalc.nSumAwarded++;
				  if (aItems[i].bids.length - nRemoveApplyCalc == 1) {
					  aSuppliersCalc[sTempItemBidSupplier].exclusive++;
				  }
			  }
			  var sItems = "0";
			  if (nTotalBids >= nSuppliersWithCalc && nTotalBids > 0) {
				  sItems = "1";
			  } else if (nTotalBids <= nSuppliersWithCalc && nTotalBids > 0) {
				  sItems = "2";
			  }
			  this.getView().getModel("mcdetails").setProperty("/items/" + i + "/allbiddersitem", sItems);
		  }
		  for (var i = 0; i < aSuppliers.length; i++) {
		  	
			  this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/rfpitems", aSuppliersCalc[aSuppliers[i].id].awarded);
			  nSumAllItemsAwarded += aSuppliersCalc[aSuppliers[i].id].awarded;
			  this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/awardprice", aSuppliersCalc[aSuppliers[i].id].quoteprice);
			  nSumAllItemsPrice += aSuppliersCalc[aSuppliers[i].id].quoteprice;
			  
			  this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/distawardprice",
			      oSuppliersSumCalc.nSumPrice > 0 ? Math.round((aSuppliersCalc[aSuppliers[i].id].quoteprice / oSuppliersSumCalc.nSumPrice) * 100) : 0);
			  this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/distawarditems",
			      oSuppliersSumCalc.nSumAwarded > 0 ? Math.round((aSuppliersCalc[aSuppliers[i].id].awarded / oSuppliersSumCalc.nSumAwarded) * 100) : 0);
			  this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/exclusiveitems", aSuppliersCalc[aSuppliers[i].id].exclusive);
			  this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/lastpopricesum", aSuppliersCalc[aSuppliers[i].id].lastpopricesum);
			  this.getView().getModel("mcdetails").setProperty("/suppliers/" + aSuppliers[i].path + "/lastpopricesumquoteaward", Math.round(aSuppliersCalc[aSuppliers[i].id].lastpopricesumquoteaward * 100)/100);
			  nSumAllItemsLastPOPriceSum += aSuppliersCalc[aSuppliers[i].id].lastpopricesumquoteaward;
		  }
		  this.getView().getModel("Control").setProperty("/AnaliseItem/AwardedPrice", nSumAllItemsPrice );
		  this.getView().getModel("Control").setProperty("/AnaliseItem/AwardedItems", nSumAllItemsAwarded );
		  this.getView().getModel("Control").setProperty("/AnaliseItem/LastPOPricesSum", nSumAllItemsLastPOPriceSum );
		  this.updateCommonItems();
		  this.FilterTabelaItens(null);
	  },
	  FilterTabelaItens : function(oEvent) {
		  this.updateDiffItems();
		  var oTableItens = this.getView().byId("TabelaItens");
		  var oBinding = oTableItens.getBinding("rows");
		  var aFilters = [];
		  switch (this.getView().getModel("Control").getObject("/AnaliseItem/Exibicao")) {
			  case "0":
				  break;
			  case "1": // itens comuns
				  aFilters.push( new sap.ui.model.Filter("allbiddersitem", sap.ui.model.FilterOperator.EQ, "1") );
				  break;
			  case "2": // itens não comuns
				  aFilters.push( new sap.ui.model.Filter("allbiddersitem", sap.ui.model.FilterOperator.EQ, "2") );
				  break;
		  }
		  switch (this.getView().getModel("Control").getObject("/AnaliseItem/ExibirApenasDivergencia")){
		  	case true:
		  		aFilters.push(new sap.ui.model.Filter("hasdiffitem", sap.ui.model.FilterOperator.EQ, true ));
		  		break;
		  	case false:
		  		break;
		  }
		  oBinding.filter(aFilters);
	  }
	});
});
