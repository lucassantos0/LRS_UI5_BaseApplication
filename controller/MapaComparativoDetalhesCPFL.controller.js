sap.ui.define([ "lrs/ui5/controller/BaseController", 'sap/ui/model/json/JSONModel' ], function(BaseController, JSONModel,
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
					this._bindingPath = "eventosSourcing>/eventosSourcing/" + nEntry;
					this.byId("mapaComparativoDetalhesCPFL").bindContext(this._bindingPath);
				}
			
//						onRouteMatched : function(oEvent) {
//							  
//							  this.sId = oEvent.getParameter("arguments").rfq;
//							  var sPath =  "/ListaRfqSet('" + this.sId + "')";
//							  this.onFocusOutValores("inpVlrReaj");						  
//							  
//			                  var oTable = this.byId("tableItems"); 
//			                  oTable.bindElement(
//					                  {
//						                  "path" : "ZMMARIBA>" + sPath,
//						                  "parameters" : {
//						                  		"expand" : "ItemCompRfqNavigation"
//						                  },					                  
//						                  "events": {
//						                	  "dataRequested": jQuery.proxy(this.onTableItemsStart,this), 
//						                	  "dataReceived": jQuery.proxy(this.onTableItemsFinish,this)
//						                   }						                  
//					                  });
//			                  
//			                  var oSelectTable = this.byId("tableSelectItems"); 
//			                  oSelectTable.bindElement(
//					                  {
//						                  "path" : "ZMMARIBA>" + sPath,
//						                  "parameters" : {
//						                  		"expand" : "ItemRfqNavigation"
//						                  }
//					                  });
//			                  
//			                  
//			                  var oTableItem = this.byId("tableFechamentoItem"); 
//			                  oTableItem.bindElement(
//					                  {
//						                  "path" : "ZMMARIBA>" + sPath,
//						                  "parameters" : {
//						                  		"expand" : "FechamentoItemNavigation"
//						                  }
//					                  });
//
//			                  
//			                  var oTableForn = this.byId("tableFechamentoFornecedor"); 
//			                  oTableForn.bindElement(
//					                  {
//						                  "path" : "ZMMARIBA>" + sPath,
//						                  "parameters" : {
//						                  		"expand" : "FechamentoFornecedorNavigation"
//						                  }
//					                  });
//			                  
//			                  
//			                  
//							var listTotais = this.byId("listTotais");
//							listTotais.bindElement(
//					                  {
//						                  "path" : "ZMMARIBA>/FechamentoTotaisSet('" + this.sId + "')"
//					                  });
//							
//							var containerLayout = this.byId("containerLayout");
//							containerLayout.bindElement(
//					                  {
//						                  "path" : "ZMMARIBA>/FechamentoTotaisSet('" + this.sId + "')"
//					                  });
//							
//			                  var inpObservacao = this.byId("inpObservacao"); 
//			                  inpObservacao.bindElement(
//					                  {
//						                  "path" : "ZMMARIBA>" + sPath						                  
//					                  });
//							
//
//			                  var oSumarioHeader = this.byId("sumarioTab"); 
//			                  oSumarioHeader.bindElement(
//					                  {
//						                  "path" : "ZMMARIBA>" + sPath,
//						                  "parameters" : {
//						                  		"expand" : "SumarioHeaderNavigation"
//						                  }
//					                  });
//			                  
//			                  var oSumarioItem = this.byId("tableSumario"); 
//			                  oSumarioItem.bindElement(
//					                  {
//						                  "path" : "ZMMARIBA>" + sPath,
//						                  "parameters" : {
//						                  		"expand" : "SumarioItemNavigation"
//						                  }
//					                  });
//			                  
//						},
//							
//						onConditions: function(oEvent){
//							if (!this.oConditionsDialog) {
//				                  this.oConditionsDialog = sap.ui.xmlfragment("dialogConditions", "lrs.ui5.view.MapaComparativo.Conditions", this);
//				                  jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.oConditionsDialog);
//				                  this.getView().addDependent(this.oConditionsDialog);
//			                  }
//
//			                  this.oConditionsDialog.open();
//			                
//							  var sPath = oEvent.getSource().oParent.oBindingContexts.ZMMARIBA.sPath;
//							  
//			                  var oTableCond = sap.ui.core.Fragment.byId("dialogConditions","tableConditions");
//			                  oTableCond.bindElement(
//					                  {
//						                  "path" : "ZMMARIBA>" + sPath,
//						                  "parameters" : {
//						                  		"expand" : "ConditionsNavigation"
//						                  },					                  
//						                  "events": {
//						                	  "dataRequested": jQuery.proxy(this.onTableItemsStart,this),
//						                	  "dataReceived": jQuery.proxy(this.onTableCondFinish,this)
//						                   }						                  
//					                  });					                  
//				                
//						},
//
//						onClickConditionsClose : function(oEvent) {
//			                  this.oConditionsDialog.close();
//		                },
//		                  
//						onLive: function(oEvent){
//							this.onFocusOutValores(oEvent.getSource().sId);	
//						},
//						
//		                   onLiveMapa: function(oEvent){
//		                	  this.onInputChangeMapa(oEvent);  
//		                  },
//		                  
//		                  onSaveMapa: function(oEvent){
//		                	  this.getModel("ZMMARIBA").submitChanges({
//		                		  success: function(oData){
//		                			  sap.m.MessageToast.show("Informações Salvas!");
//		                		  },
//		                		  error: function(oError) { }
//		                		  });
//		                  },
//		                  
//		                  onExportXLS: function(oEvent){
//
//		                	  var sUrl = "/sap/opu/odata/sap/ZMM_ARIBA_SRV/FechamentoItemSet?$filter=Id eq '" + this.sId + "'&$format=xlsx";
//		                      var encodeUrl = encodeURI(sUrl);
//		            	      sap.m.URLHelper.redirect(encodeUrl,true);
//
//		                  },
//		                 
//		                  onExportXLS2: function(oEvent){
//
//		                	  var sUrl = "/sap/opu/odata/sap/ZMM_ARIBA_SRV/ItemRfqSet?$filter=Id eq '" + this.sId + "'&$format=xlsx";
//		                      var encodeUrl = encodeURI(sUrl);
//		            	      sap.m.URLHelper.redirect(encodeUrl,true);
//
//		                  },
//		                  
//		                  onInputChangeMapa : function(oEvent) {
//			                  var oBinding = oEvent.getSource().getBinding("value");
//			                  this.getModel("ZMMARIBA").setProperty(oBinding.getContext().getPath() + "/" + oBinding.getPath(), oEvent.getParameter("newValue"));
//		                  },
//		                  
//						onFocusOutValores: function(idInput){
//		                  	
//		                  	var inpId = this.byId(idInput);
//		                  	inpId.attachBrowserEvent("focusout", function(oEvent) {     
//		                          var str = inpId.getValue();
//		                          var sNum = "";
//		                          var sDec = "";
//		                          var aNum = null;
//		                          if (str.indexOf(',') > -1) {
//
//		                              aNum = str.split(',');
//		                              sNum = aNum[0];
//		                              sDec = aNum[1];
//
//		                              if (sDec.length === 0) {
//		                                  sDec += '00';
//		                              }
//		                              if (sDec.length === 1) {
//		                                  sDec += '0';
//		                              }
//		                              if (sDec.length > 2) {
//		                                  sDec = sDec.substring(0, 2);
//		                              }
//
//		                          } else if (str.indexOf('.') > -1) {
//
//		                              aNum = str.split('.');
//		                              sNum = aNum[0];
//		                              sDec = aNum[1];
//
//		                              if (sDec.length === 0) {
//		                                  sDec += '00';
//		                              }
//		                              if (sDec.length === 1) {
//		                                  sDec += '0';
//		                              }
//		                              if (sDec.length > 2) {
//		                                  sDec = sDec.substring(0, 2);
//		                              }
//		                          } else {
//		                              sNum = str;
//		                              sDec = '00';
//		                          }
//
//		                          sNum = sNum.replace(/\D/g, "");
//
//		                          if (sNum === '') {
//		                              sNum = '0';
//		                          }
//
//		                          sNum += sDec;
//		                          sNum = sNum.replace(/\D/g, "");
//		                          sNum += '';
//
//		                          sNum = sNum.replace(/(\d)(\d{11})$/, "$1.$2");
//		                          sNum = sNum.replace(/(\d)(\d{8})$/, "$1.$2");
//		                          sNum = sNum.replace(/(\d)(\d{5})$/, "$1.$2");
//		                          sNum = sNum.replace(/(\d)(\d{2})$/, "$1,$2");
//		                          inpId.setValue(sNum);	                          
//		                          var oTable = sap.ui.getCore().byId(this.oParent.oParent.sId.substr(0,12) + "tableSelectItems");
//		                          var oTableComp = sap.ui.getCore().byId(this.oParent.oParent.sId.substr(0,12) + "tableItems");
//		                          var oItems = [];
//		                          var oItemsComp = [];
//		                          var oTotalTotais = "0";
//		                          oItems = oTable.getItems();
//		                          oItemsComp = oTableComp.getItems();
//		                          for (var i = 0; i < oItems.length; i++) { 
//		                        	    var sPathItem = oTable.getItems()[i].oBindingContexts.ZMMARIBA.sPath;
//		                        	    var sPathComp = this.oParent.oBindingContexts.ZMMARIBA.sPath
//		                        	    if (this.getModel("ZMMARIBA").getProperty(sPathItem + "/Item") === this.getModel("ZMMARIBA").getProperty(sPathComp + "/Item") ){
//		                        	    			                        	    	
//		                        	    	//calculo
//		                        	    	var oNITEM = this.getModel("ZMMARIBA").getProperty(sPathItem + "/Item");
//		                        	    	var oNegociado = this.getModel("ZMMARIBA").getProperty(sPathItem + "/ValorTotalNegociadoComImpostos");
//		                        	    	var oQtde = this.getModel("ZMMARIBA").getProperty(sPathComp + "/QuantidadeAtual");
//		                        	    	var oReaj = sNum;
//		                        	    	if ( oReaj !== "0,00" ){
//		                        	    		oNegociado = oNegociado.replace(/\s+/g, '');
//		                        	    		oNegociado = oNegociado.replace(/\./g,'');
//		                        	    		oNegociado = oNegociado.replace(/\,/g,'.');
//		                        	    		oReaj = oReaj.replace(/\s+/g, '');
//		                        	    		oReaj = oReaj.replace(/\./g,'');
//		                        	    		oReaj = oReaj.replace(/\,/g,'.');
//			                        	    	oQtde = oQtde.replace(/\s+/g, '');	
//			                        	    	oQtde = oQtde.replace(/\./g,'');
//			                        	    	oQtde = oQtde.replace(/\,/g,'.');
//			                        	    	var oVlrTotal = ( Number(oReaj) * Number(oQtde) ).toFixed(2);
//		                        	    		var oPer = ( ( Number(oNegociado) / Number(oVlrTotal) - 1 ) * 100 ).toFixed(2);
//		                        	    		oPer = oPer.replace(".", ",");		                        	    	
//			                        	    	this.getModel("ZMMARIBA").setProperty(sPathItem + "/PercRef",oPer);			                        	    	
//			                        	    	oVlrTotal = oVlrTotal.replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
//			                        	    	this.getModel("ZMMARIBA").setProperty(sPathComp + "/ValorTotal",oVlrTotal);
//		                        	    	}else{
//			                        	    	this.getModel("ZMMARIBA").setProperty(sPathItem + "/PercRef","0,00");
//			                        	    	this.getModel("ZMMARIBA").setProperty(sPathItem + "/ValorTotal","0,00");
//		                        	    	}
//		                        	    	
//			  		                        if (this.mProperties.value == sNum){
//			  		                        	this.getModel("ZMMARIBA").setProperty(sPathComp + "/ValorReajuste", sNum);
//			  		                        	this.getModel("ZMMARIBA").setProperty(sPathComp + "/Item", oNITEM);
//					                        }
//			  		                        
//		                        	    }
//	                        	    	
//		                        	}
//		                          
//		                          for (var i = 0; i < oItemsComp.length; i++) { 
//		                        	    var sPathComp = oTableComp.getItems()[i].oBindingContexts.ZMMARIBA.sPath;
//	                        	    	var oVlrTotal = this.getModel("ZMMARIBA").getProperty(sPathComp + "/ValorTotal");
//	                        	    	oVlrTotal = oVlrTotal.replace(/\s+/g, '');	
//	                        	    	oVlrTotal = oVlrTotal.replace(/\./g,'');
//	                        	    	oVlrTotal = oVlrTotal.replace(/\,/g,'.');
//	                        	    	oTotalTotais = ( Number(oTotalTotais) + Number(oVlrTotal) ).toFixed(2);			                        	  
//		                          }
//		                          var oContainer = sap.ui.getCore().byId(this.oParent.oParent.sId.substr(0,12) + "containerLayout");
//		                          var sPathTotal = oContainer.mBoundObjects.ZMMARIBA.sBindingPath;
//		                          oTotalTotais = oTotalTotais.replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
//		                          this.getModel("ZMMARIBA").setProperty(sPathTotal + "/TotalRefImp",oTotalTotais);
//		                          
//		                      }); 	       
//		                  },
//		                  
//		                  onInputVlChange : function(oEvent) {
//			                  var oBinding = oEvent.getSource().getBinding("value");
//			                  this.getModel("ZMMARIBA").setProperty(oBinding.getContext().getPath() + "/" + oBinding.getPath(), oEvent.getParameter("newValue"));
//		                  },
//		                  
//		                  
//						onTableItemsStart : function(oEvent) {
//							sap.ui.core.BusyIndicator.show(0);
//						},			
//						onTableCondFinish : function(oEvent) {
//							sap.ui.core.BusyIndicator.hide();
//						},
//						onTableItemsFinish : function(oEvent) {
//							sap.ui.core.BusyIndicator.hide();
//							var oPage = this.byId("mapaComparativoDetalhesCPFL");
//							var sPath = this.byId("tableSelectItems").getItems()[0].oBindingContexts.ZMMARIBA.sPath;
//							var sEmpresa = oEvent.getSource().oModel.getProperty(sPath + "/Empresa");
//							var sTitulo = oEvent.getSource().oModel.getProperty(sPath + "/Titulo");
//							var sRfq = oEvent.getSource().oModel.getProperty(sPath + "/Id");
//							oPage.setTitle("Mapa Comparativo de Preços - " + sRfq + " - " + sEmpresa);
//							this.byId("titleMapa").setText(sTitulo);
//						}
			
					});
});
