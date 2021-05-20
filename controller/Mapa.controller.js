sap.ui.define(
	[
		"lrs/ui5/controller/BaseController",
		'sap/ui/model/json/JSONModel',
		"lrs/ui5/controller/formatter",
		"sap/m/MessageBox",
		"sap/ui/core/Fragment",
		"sap/m/Dialog",
		"sap/m/Label",
		"sap/ui/export/Spreadsheet",
		"sap/m/MessageToast",
		"sap/m/Text",
		"sap/m/MessagePopover",
		"sap/m/MessageItem"],
	function (BaseController, JSONModel, formatter, MessageBox, Fragment, Dialog, Label, Spreadsheet, MessageToast, Text, MessagePopover, MessageItem) {
		"use strict";
		return BaseController.extend("lrs.ui5.controller.Mapa",
			{
				formatter: formatter,
				onInit: function () {
					this.getRouter().getRoute("MapaComparativoV2").attachMatched(this.onRouteMatched, this);
					this._oControlModelData = {
						"AnaliseItem": {
							"UltimoPrecoVisivel": false,
							"Exibicao": 0,
							"AwardedPrice": 0,
							"AwardedItems": 0,
							"IndiceIGPM": 0,
							"LastPOPriceSum": 0,
							"LastPOPriceSumAvg": 0,
							"CommonAwardedPrice": 0,
							"CommonAwardedItems": 0,
							"NotCommonAwardedPrice": 0,
							"NotCommonAwardedItems": 0
						}
					};


					this._oControlModel = new sap.ui.model.json.JSONModel(
						this._oControlModelData);
					this.getView().setModel(this._oControlModel, "Control");

					/*
					//
					var url_string = window.location.href;
					var url = new URL(url_string);
					var rfq = url.searchParams.get("rfq");
					this.LoadRFPData(rfq);

					// Upload Control 
					this.getModel("mcMapHelpers").setHeaders({ "X-Requested-With": "X" });
					this.byId("UploadCollection").setModel(this.getModel("mcMapHelpers"));
					this.getModel("mcMapHelpers").setSizeLimit("20000");
					*/
				},
				onRouteMatched: function (oEvent) {
					this.sDocument = oEvent.getParameters().arguments.rfq;
					if (!this.sDocument) {
						this.updateTabelaConfiguracaoFornecedores();
					} else {
						this.LoadRFPData(this.sDocument);
					}
				},
				LoadRFPData: function (sDocument) {
					this.getView().getModel("mcdetails").attachRequestFailed(this.onmcdetailsModelLoadFailed.bind(this));
					this.getView().getModel("mcdetails").attachRequestSent(this.onmcdetailsModelLoadSent.bind(this));
					this.getView().getModel("mcdetails").attachRequestCompleted(this.onmcdetailsModelLoadCompleted.bind(this));
					this.sDocument = sDocument;
					this.getView().getModel("mcdetails").loadData("/sap/bc/zmapa001?rfq=" + sDocument);
				},
				HeaderChangeDocument: function (oEvent) {
					var dialog = new Dialog(
						{
							title: 'Buscar RFP',
							type: 'Message',
							content:
								[new Label(
									{
										text: 'Informar código documento (formato DocXXXX) para consulta.',
										labelFor: 'submitDialogTextarea'
									}), new sap.m.TextArea('submitDialogTextarea',
										{
											liveChange: function (oEvent) {
												var sText = oEvent.getParameter('value');
												var parent = oEvent.getSource().getParent();

												parent.getBeginButton().setEnabled(sText.length > 3);
											},
											width: '100%',
											placeholder: 'Doc123456789'
										})],
							beginButton: new sap.m.Button(
								{
									text: 'Buscar',
									enabled: false,
									press: function () {
										var sDocument = sap.ui.getCore().byId('submitDialogTextarea').getValue();
										this.LoadRFPData(sDocument);
										dialog.close();
									}.bind(this)
								}),
							endButton: new sap.m.Button(
								{
									text: 'Cancelar',
									press: function () {
										dialog.close();
									}
								}),
							afterClose: function () {
								dialog.destroy();
							}
						});

					dialog.open();
				},
				onmcdetailsModelLoadFailed: function (oEvent) {
					this.byId("mainPagePriceComparison").setBusy(false);
				},
				onmcdetailsModelLoadSent: function (oEvent) {
					this.byId("mainPagePriceComparison").setBusy(true);
				},
				onmcdetailsModelLoadCompleted: function (oEvent) {
					this.byId("mainPagePriceComparison").setBusy(false);
					if (!oEvent.getParameter("success")) {
						MessageBox.error(oEvent.getParameter("errorobject").responseText,
							{
								icon: "sap-icon://message-error",
								title: "Erro na consulta RFQ " + this.sRfq
							});
					} else {
						// SUCESSO
						this.sRfq = this.sDocument;
						this.updateTabelaConfiguracaoFornecedores();

						// Upload Filtering 
						var aFilter = [new sap.ui.model.Filter("Docid", sap.ui.model.FilterOperator.EQ, this.sRfq)];
						this.byId("UploadCollection").getBinding("items").filter(aFilter);
					}
				},
				onBeforeUploadStarts: function (oEvent) {
					sap.ui.core.BusyIndicator.show(0);
					var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
						name: "slug",
						value: this.sRfq + "@" + oEvent.getParameter("fileName")
					});

					oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

					var oXRequestedWith = new sap.m.UploadCollectionParameter({
						name: "X-Requested-With",
						value: "X"
					});

					oEvent.getParameters().addHeaderParameter(oXRequestedWith);
				},
				FormatSavingField: function (nValue1, nValue2) {
					if (nValue1 && nValue1 !== 0) {
						return (100 - ((nValue2 / nValue1) * 100))
							.toFixed(3);
					}else{
						return "0";
					}
				},
				FormatSavingFieldStatus: function (nValue1, nValue2) {
					return (100 - ((nValue2 / nValue1) * 100))
						.toFixed(3) >= 0 ? 'Success' : 'Error';
				},
				FormatCurrency: function (amount) {
					var oCurrency = new sap.ui.model.type.Currency({
						decimalSeparator: ',',
						groupingSeparator: '.',
						showMeasure: false
					});
					return oCurrency.formatValue([amount, "BRL"], "string");
				},
				AnaliseItemColFactory: function (sId, oContext) {
					var sColumnId = oContext.getObject().label;
					var multiLabels = [];
					if (!!oContext.getObject().labelHeader) {
						multiLabels.push(new sap.m.Label({
							text: oContext.getObject().labelHeader,
							design: "Bold",
							textAlign: sap.ui.core.TextAlign.Begin,
							width: "100%"
						}));
					}
					multiLabels.push(new sap.m.Label({
						text: sColumnId,
						design: "Bold"
					}));
					var oColumnObject = null;
					if (oContext.getObject().template.href) {
						// Create link at screen
						oColumnObject = new sap.m.Link({
							text: oContext.getObject().template.text,
							href: oContext.getObject().template.href,
							target: oContext.getObject().template.target
						});
					} else if (oContext.getObject().template.state) {
						// Check if should create object
						// status - best bidder price
						oColumnObject = new sap.m.ObjectStatus({
							text: oContext.getObject().template.text,
							state: oContext.getObject().template.state,
							icon: oContext.getObject().template.stateicon
						});
					} else if (oContext.getObject().template.type === "sap.m.Input") {
						oColumnObject = new sap.m.Input({
							value: oContext.getObject().template.text
						});
					} else {
						oColumnObject = new sap.m.Text({
							text: oContext.getObject().template.text
						});
					}

					var oColumn = new sap.ui.table.Column({
						headerSpan: oContext.getObject().headerSpan,
						hAlign: oContext.getObject().hAlign != "" ? oContext
							.getObject().hAlign : "Begin",
						multiLabels: multiLabels,
						sortProperty: oContext.getObject().sortProperty != "" ? oContext.getObject().sortProperty : null,
						filterProperty: oContext.getObject().filterProperty != "" ? oContext.getObject().filterProperty : null,
						resizable: false,
						width: oContext.getObject().minWidth,
						visible: oContext.getObject().visible,
						template: oColumnObject
					});

					return oColumn;
				},
				ValorUltimoPrecoCorrigido: function (nLastPOPricesSum, nIndiceIGPM) {
					if (!nLastPOPricesSum) { return ""; }
					if (nIndiceIGPM === 0 || !nIndiceIGPM) { return this.FormatCurrency((nLastPOPricesSum).toFixed(2)); }
					return this.FormatCurrency((nLastPOPricesSum + (nLastPOPricesSum * (nIndiceIGPM / 100))).toFixed(2));
				},
				ValorCorrigidoUltPrecoSomatorio: function (nLastPOPriceSum, nLastPOPriceSumIndexed, nIndex) {
					if (!nIndex) {
						nIndex = 0;
					}
					return this
						.FormatCurrency(((Number(nLastPOPriceSumIndexed) + (Number(nLastPOPriceSumIndexed) * (nIndex / 100))) + Number(nLastPOPriceSum))
							.toFixed(2));
				},
				ValorCorrigidoUltPrecoSomatorioDiff: function (nSomatorioRfp, nLastPOPriceSum, nLastPOPriceSumIndexed, nIndex) {
					if (!nLastPOPriceSum) {
						return "";
					}
					var nFixedIndexValue = Number(nLastPOPriceSum) + Number(nLastPOPriceSumIndexed) + (Number(nLastPOPriceSumIndexed) * (nIndex / 100));
					if (nFixedIndexValue === 0) {
						return "0";
					}
					return nFixedIndexValue > nSomatorioRfp ? Math
						.round(((nFixedIndexValue - nSomatorioRfp) / nSomatorioRfp) * 100) : Math
							.round(((nSomatorioRfp - nFixedIndexValue) / nFixedIndexValue) * 100) * -1;
				},
				ValorCorrigidoUltPrecoSomatorioDiffState: function (nSomatorioRfp, nLastPOPriceSum, nLastPOPriceSumIndexed, nIndex) {
					var nFixedIndexValue = Number(nLastPOPriceSum) + Number(nLastPOPriceSumIndexed) + (Number(nLastPOPriceSumIndexed) * (nIndex / 100));
					return nFixedIndexValue > nSomatorioRfp ? "Success" : "Error";
				},
				MessagesShow: function (oEvent) {
					if (!this._oDialog) {
						// create dialog via fragment factory
						this._oDialog = sap.ui.xmlfragment("fragmentMapaLogMensagens", "lrs.ui5.view.Mapa.MapaLogMensagens", this);
						// connect dialog to view (models, lifecycle)
						this.getView().addDependent(this._oDialog);
						this._oDialog.setModel(this.getView().getModel("mcdetails"), "mcdetails");
					}
					this._oDialog.bindElement("mcdetails>" + oEvent.getSource().getParent().getBindingContextPath());
					this._oDialog.open();
				},
				MessagesClose: function () {
					this._oDialog.close();
				},
				MessageButtonIcon: function (sMessage) {
					if (!sMessage) { return null; }
					if (sMessage === "Error") {
						return "sap-icon://message-error";
					} else if (sMessage === "Warning") {
						return "sap-icon://message-warning";
					} else if (sMessage === "Information") { return ""; }
				},
				MessageButtonColor: function (sMessage) {
					if (!sMessage) { return null; }
					if (sMessage === "Error") {
						return "red";
					} else if (sMessage === "Warning") {
						return "yellow";
					} else if (sMessage === "Information") { return ""; }
				},
				MessageButtonIcon: function (sMessage) {
					if (!sMessage) {
						return null;
					}
					if (sMessage === "E") {
						return "sap-icon://message-error";
					} else if (sMessage === "W") {
						return "sap-icon://message-warning";
					} else if (sMessage === "I") {
						return "";
					}
				},
				MessagesButtonIcon: function (aMessages) {
					var bWarning = false;
					if (!aMessages) {
						return null;
					}
					for (var i = 0; i < aMessages.length; i++) {
						if (aMessages[i].type === "E") {
							return "sap-icon://message-error";
						}
						if (aMessages[i].type === "W") {
							bWarning = true;
						}
					}
					return bWarning ? "sap-icon://message-warning" : "sap-icon://message-success";
				},
				MessagesButtonColor: function (aMessages) {
					var bWarning = false;
					if (!aMessages) { return null; }
					for (var i = 0; i < aMessages.length; i++) {
						if (aMessages[i].type === "Error") { return "Reject"; }
					}
					return "Default";
					// return bWarning ? "yellow" : "green";
				},

				MessagesButtonVisible: function (aMessages) {
					if (!aMessages) { return false; }
					return aMessages.length > 0;
				},
				TabelaConfiguracaoFornecedoresNome: function (sId, sNome) {
					return sId == sNome ? sId : sId + " " + sNome;
				},
				updateDiffItems: function () {
					// hasdiffitem = true (tem
					// divergencias em pelo menos uma
					// oferta)
					// hasdiffitem = false (todos os
					// bids est�o OK)
					var aItems = this.getView().getModel("mcdetails")
						.getObject("/items");
					var aSuppliers = this.getView()
						.getModel("mcdetails")
						.getObject("/suppliers");
					var aSuppliersCalc = [];
					var bHasdiff = false;
					for (var i = 0; i < aSuppliers.length; i++) {
						aSuppliersCalc[aSuppliers[i].id] = {
							applyCalc: aSuppliers[i].applyCalc
						};
					}
					for (var i = 0; i < aItems.length; i++) {
						bHasdiff = false;
						for (var j = 0; j < aItems[i].bids.length; j++) {
							if (!!aSuppliersCalc[aItems[i].bids[j].supplier]) {
								if (!!aSuppliersCalc[aItems[i].bids[j].supplier].applyCalc && !!aItems[i].bids[j].hasdiff) {
									bHasdiff = true;
								}
							}
						}
						this.getView().getModel("mcdetails")
							.setProperty("/items/" + i + "/hasdiffitem", bHasdiff);
					}
				},

				buildDynamicConfiguration: function (aUITableConfiguration) {
					var aDynamicConfiguration = [];
					aUITableConfiguration.forEach(function (oUITableConfiguration) {
						if (oUITableConfiguration.hasOwnProperty("supplierQualifier") && oUITableConfiguration.supplierQualifier.length > 0) {
							var iPath = parseInt(oUITableConfiguration.supplierQualifier);
							var oConfigurationOut = JSON.parse(JSON.stringify(oUITableConfiguration));
							var oTemplateProperties = Object.keys(oConfigurationOut.template);
							oTemplateProperties.forEach(function (sProperty) {
								oConfigurationOut.template[sProperty] = oConfigurationOut.template[sProperty].split("mcdetails>").join("itemAnalysis>");
							});

							if (aDynamicConfiguration[iPath] === undefined) {
								aDynamicConfiguration[iPath] = [oConfigurationOut];
							} else {
								aDynamicConfiguration[iPath].push(oConfigurationOut);
							}
						}
					});
					return aDynamicConfiguration;
				},

				changeFieldValue: function (oEvent) {
					debugger;
				},

				updateItemAnalysis: function () {
					var aItemsIn = this.getView().getModel("mcdetails").getObject("/items");
					var aSuppliersBase = this.getView().getModel("mcdetails").getObject("/suppliers");
					var aUITableConfiguration = this.getView().getModel("mcdetails").getObject("/ui5tableconf1");
					var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
					var aDynamicConfiguration = [];
					var aItemsOut = [];

					// Remove Supplier Tree Columns 
					var oTree = this.byId("treeItems");
					oTree.getColumns().forEach(function (oTreeColumn) {
						var oTreeColumnData = oTreeColumn.data();
						if (oTreeColumnData.isVendorColumn) {
							oTree.removeColumn(oTreeColumn);
						}
					});

					// Supplier Pricing Grouping
					aDynamicConfiguration = this.buildDynamicConfiguration(aUITableConfiguration);

					// Supplier Columns
					var aSuppliers = aSuppliersBase.filter(oSupplier => oSupplier.applyCalc);
					aSuppliers.forEach(function (oSupplier) {
						// Input Variants
						var sText = "";

						// Find the Total 
						if (aDynamicConfiguration[oSupplier.path] !== undefined) {
							var oTotalConfiguration = aDynamicConfiguration[oSupplier.path].find(function (oElement) {
								return oElement.supplierTotal;
							});
							sText = oTotalConfiguration.template.text;
						}

						var oTextBase = new sap.m.Text({
							text: sText,
							visible: {
								path: "itemAnalysis>isItem",
								formatter: function (isItem) {
									return (isItem ? true : false);
								}
							}
						});
						oTextBase.addStyleClass("textTotal");

						var oVendorColumnVariants = new sap.m.VBox({
							items: [oTextBase]
						});

						// Vendor Functions 
						if (aDynamicConfiguration[oSupplier.path] !== undefined) {
							aDynamicConfiguration[oSupplier.path].forEach(function (oDynamicConfiguration) {
								if (!oDynamicConfiguration.supplierTotal) {
									var oTemplate = oDynamicConfiguration.template;
									var oColumnObject = {};

									if (oTemplate.href) {
										oColumnObject = new sap.m.Link({
											text: oTemplate.text,
											href: oTemplate.href,
											target: oTemplate.target,
											visible: {
												parts: [{
													path: "itemAnalysis>dynamicConfiguration"
												}],
												formatter: function (oConfiguration) {
													if (oConfiguration) {
														if (Object.keys(oConfiguration).length > 0) {
															var oControlData = this.data();
															return oConfiguration.label === oControlData.label;
														} else {
															return false;
														}
													} else {
														return false;
													}
												}
											}
										});
									} else if (oTemplate.state) {
										oColumnObject = new sap.m.ObjectStatus({
											text: oTemplate.text,
											state: oTemplate.state,
											icon: oTemplate.stateicon,
											visible: {
												parts: [{
													path: "itemAnalysis>dynamicConfiguration"
												}],
												formatter: function (oConfiguration) {
													if (oConfiguration) {
														if (Object.keys(oConfiguration).length > 0) {
															var oControlData = this.data();
															return oConfiguration.label === oControlData.label;
														} else {
															return false;
														}
													} else {
														return false;
													}
												}
											}
										});
									} else if (oTemplate.type === "sap.m.Input") {
										oColumnObject = new sap.m.Input({
											value: oTemplate.text,
											visible: {
												parts: [{
													path: "itemAnalysis>dynamicConfiguration"
												}],
												formatter: function (oConfiguration) {
													if (oConfiguration) {
														if (Object.keys(oConfiguration).length > 0) {
															var oControlData = this.data();
															return oConfiguration.label === oControlData.label;
														} else {
															return false;
														}
													} else {
														return false;
													}
												}
											}
										});
									} else if (oTemplate.type === "sap.m.ComboBox") {
										var sSelectedKey = oTemplate.value;

										oColumnObject = new sap.m.ComboBox({
											selectedKey: "{" + sSelectedKey + "}",
											change: this.changeFieldValue,
											items: {
												path: oTemplate.valueHelper,
												template: new sap.ui.core.ListItem({
													key: "{mcMapHelpers>Key}",
													text: "{mcMapHelpers>Key} - {mcMapHelpers>Value}"
												})
											},

											visible: {
												parts: [{
													path: "itemAnalysis>dynamicConfiguration"
												}],
												formatter: function (oConfiguration) {
													if (oConfiguration) {
														if (Object.keys(oConfiguration).length > 0) {
															var oControlData = this.data();
															return oConfiguration.label === oControlData.label;
														} else {
															return false;
														}
													} else {
														return false;
													}
												}
											}
										});
									} else {
										oColumnObject = new sap.m.Text({
											text: oTemplate.text,
											visible: {
												parts: [{
													path: "itemAnalysis>dynamicConfiguration"
												}],
												formatter: function (oConfiguration) {
													if (oConfiguration) {
														if (Object.keys(oConfiguration).length > 0) {
															var oControlData = this.data();
															return oConfiguration.label === oControlData.label;
														} else {
															return false;
														}
													} else {
														return false;
													}
												}
											}
										});
									}
									var sLabel = oDynamicConfiguration.label.replace("{i18n>", "").replace("}", "");
									oColumnObject.data("label", oResourceBundle.getText(sLabel));
									oVendorColumnVariants.addItem(oColumnObject);
								}
							}.bind(this));
						}

						var oVendorColumn = new sap.ui.table.Column({
							label: oSupplier.name,
							width: "10rem",
							visible: oSupplier.applyCalc,
							template: oVendorColumnVariants
						});

						oVendorColumn.data("isVendorColumn", "true");
						oTree.addColumn(oVendorColumn);
					}.bind(this));

					aItemsIn.forEach(function (oItemIn) {
						var oItemOut = JSON.parse(JSON.stringify(oItemIn));
						oItemOut.nodeId = oItemOut.rfqitem;
						oItemOut.children = [];
						oItemOut.isItem = true;
						oItemOut.dynamicConfiguration = {};

						var oConditionsIn = {
							nodeId: "Condições",
							isItem: false,
							dynamicConfiguration: {},
							children: []
						};

						var oConditionLabels = {};
						aSuppliers.forEach(function (oSupplier) {
							if (aDynamicConfiguration[oSupplier.path] !== undefined) {
								aDynamicConfiguration[oSupplier.path].forEach(function (oDynamicConfiguration) {
									if (!oConditionLabels[oDynamicConfiguration.label] && !oDynamicConfiguration.supplierTotal) {
										oConditionLabels[oDynamicConfiguration.label] = true;
										var oPricingOut = JSON.parse(JSON.stringify(oItemIn));
										var sLabel = oDynamicConfiguration.label.replace("{i18n>", "").replace("}", "");
										oPricingOut.nodeId = oResourceBundle.getText(sLabel);
										oPricingOut.isItem = false;
										oPricingOut.dynamicConfiguration = JSON.parse(JSON.stringify(oDynamicConfiguration));
										oPricingOut.dynamicConfiguration.label = oResourceBundle.getText(sLabel);
										if (oPricingOut.isservice == "X") {
											if (oPricingOut.nodeId == "Al.ICMS SAP" || oPricingOut.nodeId == "Al.IPI SAP" || oPricingOut.nodeId == "DIFAL SAP" || oPricingOut.nodeId == "ICMS ST") {
												return;
											}
											//AL.ICMS SAP, ALI.IPI SAP, DIFAL SAP
										}
										else {
											if (oPricingOut.nodeId == "Al.ISS SAP") {
												return;
											}
										}
										oConditionsIn.children.push(oPricingOut);
									}
								});
							}
						});
						if (oConditionsIn.children.length > 0) {
							oItemOut.children.push(oConditionsIn);
						}
						aItemsOut.push(oItemOut);
					});
					this.getModel("itemAnalysis").setData({
						items: aItemsOut,
						suppliers: aSuppliersBase
					});
					this.getModel("itemAnalysis").refresh(true);
				},

				updateCommonItems: function () {
					// allbiddersitem = 1 (itens comuns)
					// allbiddersitem = 2 (itens nao
					// comuns)
					var aItems = this.getView().getModel("mcdetails")
						.getObject("/items");
					var aSuppliers = this.getView()
						.getModel("mcdetails")
						.getObject("/suppliers");
					var aSuppliersCommon = [];
					var aSuppliersNotCommon = [];
					var nTempItemBidPrice;
					var sTempItemBidSupplier;
					var sTempItemBidSupplierName;
					var nTempItemBidSupplierDate;
					var nTempItemBidSupplierQuoted;
					var nSumCommonPrice = 0;
					var nSumCommonItems = 0;
					var nSumNotCommonPrice = 0;
					var nSumNotCommonItems = 0;
					for (var i = 0; i < aSuppliers.length; i++) {
						aSuppliersCommon[aSuppliers[i].id] = {
							name: aSuppliers[i].name,
							quoteditems: aSuppliers[i].quoteditems,
							applyCalc: aSuppliers[i].applyCalc,
							quoteprice: 0,
							quoteitems: 0,
							awardeditems: 0,
							awardedprice: 0,
							distawarditems: 0,
							distawardprice: 0,
						};
						aSuppliersNotCommon[aSuppliers[i].id] = {
							name: aSuppliers[i].name,
							quoteditems: aSuppliers[i].quoteditems,
							applyCalc: aSuppliers[i].applyCalc,
							quoteprice: 0,
							quoteitems: 0,
							awardeditems: 0,
							awardedprice: 0,
							distawarditems: 0,
							distawardprice: 0,
						};
					}
					for (var i = 0; i < aItems.length; i++) {
						nTempItemBidPrice = 0;
						sTempItemBidSupplier = "";
						sTempItemBidSupplierName = "";
						nTempItemBidSupplierDate = 0;
						nTempItemBidSupplierQuoted = 0;
						for (var j = 0; j < aItems[i].bids.length; j++) {
							if (!aItems[i].bids[j].supplier) {
								continue;
							}
							if (!aSuppliersCommon[aItems[i].bids[j].supplier].applyCalc) {
								continue;
							}

							switch (aItems[i].allbiddersitem) {
								case "1": // itens comuns
									aSuppliersCommon[aItems[i].bids[j].supplier].quoteitems++;
									aSuppliersCommon[aItems[i].bids[j].supplier].quoteprice += (aItems[i].bids[j].bidprice / aItems[i].bids[j].por) * aItems[i].quantity;
									if (nTempItemBidPrice == 0) {
										nTempItemBidPrice = aItems[i].bids[j].bidprice / aItems[i].bids[j].por;
										sTempItemBidSupplier = aItems[i].bids[j].supplier;
										sTempItemBidSupplierName = aSuppliersCommon[aItems[i].bids[j].supplier].name;
										nTempItemBidSupplierDate = aItems[i].bids[j].deliverydate;
										nTempItemBidSupplierQuoted = aSuppliersCommon[aItems[i].bids[j].supplier].quoteditems;
									} else if (nTempItemBidPrice > (aItems[i].bids[j].bidprice / aItems[i].bids[j].por)) {
										nTempItemBidPrice = aItems[i].bids[j].bidprice / aItems[i].bids[j].por;
										sTempItemBidSupplier = aItems[i].bids[j].supplier;
										sTempItemBidSupplierName = aSuppliersCommon[aItems[i].bids[j].supplier].name;
										nTempItemBidSupplierDate = aItems[i].bids[j].deliverydate;
										nTempItemBidSupplierQuoted = aSuppliersCommon[aItems[i].bids[j].supplier].quoteditems;
									} else if (nTempItemBidPrice == (aItems[i].bids[j].bidprice / aItems[i].bids[j].por)) {
										// APLICAR CRITERIO
										// DESEMPATE
										// Alem de comparar
										// o preço, comparar
										// em ordem os
										// critérios de
										// desempate:
										// 2. Delivery date
										// (prazo de entrega
										// em dias)
										// 3. Qtde de itens
										// ofertados por
										// fornecedor
										// 4. Nome do
										// fornecedor (ordem
										// alfabetica)
										if (Number(nTempItemBidSupplierDate) > Number(aItems[i].bids[j].deliverydate)) {
											nTempItemBidPrice = aItems[i].bids[j].bidprice / aItems[i].bids[j].por;
											sTempItemBidSupplier = aItems[i].bids[j].supplier;
											sTempItemBidSupplierName = aSuppliersCommon[aItems[i].bids[j].supplier].name;
											nTempItemBidSupplierDate = aItems[i].bids[j].deliverydate;
											nTempItemBidSupplierQuoted = aSuppliersCommon[aItems[i].bids[j].supplier].quoteditems;
										} else if (nTempItemBidSupplierQuoted < aSuppliersCommon[aItems[i].bids[j].supplier].quoteitems) {
											nTempItemBidPrice = aItems[i].bids[j].bidprice / aItems[i].bids[j].por;
											sTempItemBidSupplier = aItems[i].bids[j].supplier;
											sTempItemBidSupplierName = aSuppliersCommon[aItems[i].bids[j].supplier].name;
											nTempItemBidSupplierDate = aItems[i].bids[j].deliverydate;
											nTempItemBidSupplierQuoted = aSuppliersCommon[aItems[i].bids[j].supplier].quoteditems;
										} else if (sTempItemBidSupplierName
											.localeCompare(aSuppliersCommon[aItems[i].bids[j].supplier].name) >= 0) {
											nTempItemBidPrice = aItems[i].bids[j].bidprice / aItems[i].bids[j].por;
											sTempItemBidSupplier = aItems[i].bids[j].supplier;
											sTempItemBidSupplierName = aSuppliersCommon[aItems[i].bids[j].supplier].name;
											nTempItemBidSupplierDate = aItems[i].bids[j].deliverydate;
											nTempItemBidSupplierQuoted = aSuppliersCommon[aItems[i].bids[j].supplier].quoteditems;
										}
									}
									break;
								case "2": // itens não
									// comuns
									aSuppliersNotCommon[aItems[i].bids[j].supplier].quoteitems++;
									aSuppliersNotCommon[aItems[i].bids[j].supplier].quoteprice += (aItems[i].bids[j].bidprice / aItems[i].bids[j].por) * aItems[i].quantity;
									if (nTempItemBidPrice == 0) {
										nTempItemBidPrice = aItems[i].bids[j].bidprice / aItems[i].bids[j].por;
										sTempItemBidSupplier = aItems[i].bids[j].supplier;
										sTempItemBidSupplierName = aSuppliersNotCommon[aItems[i].bids[j].supplier].name;
										nTempItemBidSupplierDate = aItems[i].bids[j].deliverydate;
										nTempItemBidSupplierQuoted = aSuppliersNotCommon[aItems[i].bids[j].supplier].quoteditems;
									} else if (nTempItemBidPrice > (aItems[i].bids[j].bidprice / aItems[i].bids[j].por)) {
										nTempItemBidPrice = aItems[i].bids[j].bidprice / aItems[i].bids[j].por;
										sTempItemBidSupplier = aItems[i].bids[j].supplier;
										sTempItemBidSupplierName = aSuppliersNotCommon[aItems[i].bids[j].supplier].name;
										nTempItemBidSupplierDate = aItems[i].bids[j].deliverydate;
										nTempItemBidSupplierQuoted = aSuppliersNotCommon[aItems[i].bids[j].supplier].quoteditems;
									} else if (nTempItemBidPrice == (aItems[i].bids[j].bidprice / aItems[i].bids[j].por)) {
										// APLICAR CRITERIO
										// DESEMPATE
										// Alem de comparar
										// o preço, comparar
										// em ordem os
										// critérios de
										// desempate:
										// 2. Delivery date
										// (prazo de entrega
										// em dias)
										// 3. Qtde de itens
										// ofertados por
										// fornecedor
										// 4. Nome do
										// fornecedor (ordem
										// alfabetica)
										if (Number(nTempItemBidSupplierDate) > Number(aItems[i].bids[j].deliverydate)) {
											nTempItemBidPrice = aItems[i].bids[j].bidprice / aItems[i].bids[j].por;
											sTempItemBidSupplier = aItems[i].bids[j].supplier;
											sTempItemBidSupplierName = aSuppliersNotCommon[aItems[i].bids[j].supplier].name;
											nTempItemBidSupplierDate = aItems[i].bids[j].deliverydate;
											nTempItemBidSupplierQuoted = aSuppliersNotCommon[aItems[i].bids[j].supplier].quoteditems;
										} else if (nTempItemBidSupplierQuoted < aSuppliersNotCommon[aItems[i].bids[j].supplier].quoteitems) {
											nTempItemBidPrice = aItems[i].bids[j].bidprice / aItems[i].bids[j].por;
											sTempItemBidSupplier = aItems[i].bids[j].supplier;
											sTempItemBidSupplierName = aSuppliersNotCommon[aItems[i].bids[j].supplier].name;
											nTempItemBidSupplierDate = aItems[i].bids[j].deliverydate;
											nTempItemBidSupplierQuoted = aSuppliersNotCommon[aItems[i].bids[j].supplier].quoteditems;
										} else if (sTempItemBidSupplierName
											.localeCompare(aSuppliersNotCommon[aItems[i].bids[j].supplier].name) >= 0) {
											nTempItemBidPrice = aItems[i].bids[j].bidprice / aItems[i].bids[j].por;
											sTempItemBidSupplier = aItems[i].bids[j].supplier;
											sTempItemBidSupplierName = aSuppliersNotCommon[aItems[i].bids[j].supplier].name;
											nTempItemBidSupplierDate = aItems[i].bids[j].deliverydate;
											nTempItemBidSupplierQuoted = aSuppliersNotCommon[aItems[i].bids[j].supplier].quoteditems;
										}
									}
									break;
							}
						}
						switch (aItems[i].allbiddersitem) {
							case "1": // itens comuns
								nSumCommonItems++;
								if (!!sTempItemBidSupplier) {
									// APLICAR CRITERIO
									// DESEMPATE - campo
									// awardeditems
									aSuppliersCommon[sTempItemBidSupplier].awardeditems++;
									aSuppliersCommon[sTempItemBidSupplier].awardedprice += (nTempItemBidPrice * aItems[i].quantity);
									nSumCommonPrice += (nTempItemBidPrice * aItems[i].quantity);
								}
								break;
							case "2": // itens não comuns
								nSumNotCommonItems++;
								if (!!sTempItemBidSupplier) {
									// APLICAR CRITERIO
									// DESEMPATE- campo
									// awardeditems
									aSuppliersNotCommon[sTempItemBidSupplier].awardeditems++;
									aSuppliersNotCommon[sTempItemBidSupplier].awardedprice += (nTempItemBidPrice * aItems[i].quantity);
									nSumNotCommonPrice += (nTempItemBidPrice * aItems[i].quantity);
								}
								break;
						}
					}
					for (var i = 0; i < aSuppliers.length; i++) {
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/common/awardeditems", aSuppliersCommon[aSuppliers[i].id].awardeditems);
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/common/awardedprice", aSuppliersCommon[aSuppliers[i].id].awardedprice);
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/common/quoteitems", aSuppliersCommon[aSuppliers[i].id].quoteitems);
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/common/quoteprice", aSuppliersCommon[aSuppliers[i].id].quoteprice);
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/common/distawarditems", nSumCommonItems > 0 ? Math
								.round((aSuppliersCommon[aSuppliers[i].id].awardeditems / nSumCommonItems) * 100) : 0);
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/common/distawardprice", nSumCommonPrice > 0 ? Math
								.round((aSuppliersCommon[aSuppliers[i].id].awardedprice / nSumCommonPrice) * 100) : 0);

						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/notcommon/awardeditems", aSuppliersNotCommon[aSuppliers[i].id].awardeditems);
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/notcommon/awardedprice", aSuppliersNotCommon[aSuppliers[i].id].awardedprice);
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/notcommon/quoteitems", aSuppliersNotCommon[aSuppliers[i].id].quoteitems);
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/notcommon/quoteprice", aSuppliersNotCommon[aSuppliers[i].id].quoteprice);
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/notcommon/distawarditems", nSumNotCommonItems > 0 ? Math
								.round((aSuppliersNotCommon[aSuppliers[i].id].awardeditems / nSumNotCommonItems) * 100) : 0);
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/notcommon/distawardprice", nSumNotCommonPrice > 0 ? Math
								.round((aSuppliersNotCommon[aSuppliers[i].id].awardedprice / nSumNotCommonPrice) * 100) : 0);
					}
					this
						.getView()
						.getModel("Control")
						.setProperty("/AnaliseItem/CommonAwardedPrice", nSumCommonPrice);
					this
						.getView()
						.getModel("Control")
						.setProperty("/AnaliseItem/CommonAwardedItems", nSumCommonItems);
					this
						.getView()
						.getModel("Control")
						.setProperty("/AnaliseItem/NotCommonAwardedPrice", nSumNotCommonPrice);
					this
						.getView()
						.getModel("Control")
						.setProperty("/AnaliseItem/NotCommonAwardedItems", nSumNotCommonItems);
				},

				onExportPDF: function () {

					var filename = this.getView().getModel("mcdetails").oData.rfqid + " - " + this.getView().getModel("mcdetails").oData.rfp;
					var doc = new jsPDF('l', 'pt');
					var aSuppliers = this.getView().getModel("mcdetails").getObject("/suppliers");

					//Cabeçalho
					doc.setFontSize(11);
					var xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(filename) * doc.internal.getFontSize() / 2);
					doc.text(filename, xOffset, 20);


					//textos
					doc.setFontSize(12);
					var justificativa = this.getView().getModel("mcdetails").getData().rfpdata.justificativa;
					doc.setFontType("bold");
					doc.text("Justificativa: ", 10, 50);
					doc.setFontType("normal");
					doc.text(justificativa, 90, 50);
					var detalhes = this.getView().getModel("mcdetails").getData().rfpdata.outrosdetalhes;
					doc.setFontType("bold");
					doc.text("Outros detalhes: ", 10, 70);
					doc.setFontType("normal");
					doc.text(detalhes, 110, 70);

					doc.setFontSize(18);
					var itensArr = this.getModel("itemAnalysis").getData().items;
					for (var i = 0; i < itensArr.length; i++) {

						if (i === 0) {
							var aStartY = 120;
							var aText = 100;
						} else {
							var aStartY = doc.autoTable.previous.finalY + 40;
							var aText = doc.autoTable.previous.finalY + 30;
						}

						var bLastPriceSelected = this.getModel("Control").getProperty("/AnaliseItem/UltimoPrecoVisivel");
						if (bLastPriceSelected) {
							var columnStyles = {
								0: { columnWidth: 22 },
								1: { columnWidth: 32 },
								2: { columnWidth: 70 },
								3: { columnWidth: 35 },
								4: { columnWidth: 35 },
								5: { columnWidth: 30 },
								6: { columnWidth: 30 },
								7: { columnWidth: 40 },
								8: { columnWidth: 60 },
								9: { columnWidth: 30 },
								10: { columnWidth: 40 },
								11: { columnWidth: 75 },
								12: { columnWidth: 40 },
								13: { columnWidth: 40 },
								14: { columnWidth: 40 },
								15: { columnWidth: 40 },
								16: { columnWidth: 30 },
								17: { columnWidth: 20 },
								18: { columnWidth: 40 },
								19: { columnWidth: 40 }
							}
						}

						//var infoTable = this.createColumnConfigPDF(aSuppliers[i].name);
						//var infoTable = this.createColumnConfigTreePDF(aSuppliers[i].path);
						var infoTable = this.createColumnConfigTreePDF(i);
						doc.setFontType("bold");
						doc.text(itensArr[i].name, 7, aText);
						doc.setFontType("normal");
						doc.autoTable(infoTable[0], infoTable[1], {
							styles: {
								valign: 'top',
								overflow: 'linebreak',
								fontSize: 5,
							},

							startY: aStartY,

							columnStyles: columnStyles,

							margin: { horizontal: 7 }

						});
						//break;
					}
					doc.save(filename + ".pdf");
					MessageToast.show('PDF exportado com sucesso!');
				},

				createColumnConfigTreePDF: function (iSupplierPath) {


					var aSuppliers = this.getView().getModel("mcdetails").getObject("/suppliers");
					var aColsIn = this.createColumnTreeConfig(iSupplierPath);
					var aItemsIn = this.createDataTreeSource(iSupplierPath);

					var aColsOut = aColsIn.map(oColumn => oColumn.label);
					var aItemsOut = [];
					aItemsIn.forEach(function (oItemIn) {
						aItemsOut.push(aColsIn.map(oColumn => oItemIn[oColumn.property]));
					});
					var aItemsOutAux = [];
					var aItemsOutAux2 = [""];
					/*var aItemsOutAux2 = 
					[
					"","IVA", "Preço", "Moeda", "Prev.Entrega", "NCM Forn", "NCM SAP", "Al.Pis SAP", "Al.Cof SAP", "Al.ICMS SAP", "Al.IPI SAP", "Al.ISS SAP", "ICMS ST","DIFAL SAP", "Preço Unit. Efetivo SAP", "Preço Total Efetivo", "Posição", "Dif. Melhor Oferta (%)"
					];*/
					var item = aItemsIn[iSupplierPath];
					for (var q = 0; q < aItemsIn[iSupplierPath].children[0].children.length; q++) {
						aItemsOutAux2.push(
							aItemsIn[iSupplierPath].children[0].children[q].nodeId
						);
					}

					var linha = [];
					for (var i = 0; i < aItemsOutAux2.length; i++) {
						if (aItemsOutAux2[i] == "") {
							linha.push("");
							linha.push(item.id);//codigo SAP
							linha.push(item.werks);
							linha.push(item.quantityStr);
							linha.push(item.uom);
							if (item.varStr != "") {
								linha.push(item.varStr);
							}
							else {
								linha.push(window.AnaliseItensVariacaoPreco(item.bids, item.lastpoprice, aSuppliers));
							}
							for (var j = 0; j < item.bids.length; j++) {
								linha.push(window.FormatValuePdf(item.bids[j].bidpriceimp * item.quantity));
							}
						}
						else {
							linha.push(aItemsOutAux2[i]);
							linha.push("");
							linha.push("");
							linha.push("");
							linha.push("");
							linha.push("");
							//console.log(aItemsOutAux2[i]);
							for (var j = 0; j < item.bids.length; j++) {
								switch (aItemsOutAux2[i]) {
									case "IVA":
										linha.push(item.bids[j].iva);
										break;
									case "Preço":
										linha.push(window.FormatValuePdf(item.bids[j].bidprice));
										break;
									case "Moeda":
										linha.push(item.bids[j].bidcurrency);
										break;
									case "Prev.Entrega":
										linha.push(item.bids[j].deliverydate);
										break;
									case "NCM Forn":
										linha.push(item.bids[j].ncmariba);
										break;
									case "NCM SAP":
										linha.push(item.bids[j].ncmerp);
										break;
									case "Al.Pis SAP":
										linha.push(window.FormatValuePdf(item.bids[j].aliqpiss));
										break;
									case "Al.Cof SAP":
										linha.push(window.FormatValuePdf(item.bids[j].aliqcofs));
										break;
									case "Al.ICMS SAP":
										linha.push(window.FormatValuePdf(item.bids[j].aliqicmss));
										break;
									case "Al.IPI SAP":
										linha.push(window.FormatValuePdf(item.bids[j].aliqipis));
										break;
									case "Al.ISS SAP":
										linha.push(window.FormatValuePdf(item.bids[j].aliqisss));
										break;
									case "ICMS ST":
										linha.push(window.FormatValuePdf(item.bids[j].icmsst));
										break;
									case "DIFAL SAP":
										linha.push(window.FormatValuePdf(item.bids[j].aliqdifals));
										break;
									case "Preço Unit. Efetivo SAP":
										linha.push(window.FormatValuePdf(item.bids[j].bidpricesunit));
										break;
									case "Preço Total Efetivo":
										linha.push(window.FormatValuePdf(item.bids[j].precototaleftv));
										break;
									case "Posição":
										linha.push(item.bids[j].posicao);
										break;
									case "Dif. Melhor Oferta (%)":
										linha.push(window.DifMelhor(item.bids, item.quantity, item.bids[j].bidprices, aSuppliers));
										break;
								}
							}
						}
						aItemsOutAux.push(linha);
						linha = [];
					}
					//var aColsOutAux =  ["Item", "Cód. SAP", "Centro", "Qtd.", "UOM", "% var"];
					var aColsOutAux = aColsOut.filter((item, index) => {
						if (index < 8 && item != "Descrição" && item != "IVA") { return item };
					});
					for (var i = 0; i < aSuppliers.length; i++) {
						aColsOutAux.push(aSuppliers[i].name);
					}

					return [aColsOutAux, aItemsOutAux];
				},

				formatValuePdf: function (value) {
					return (value).toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})
				},

				createColumnConfigPDF: function (aSupplierName) {

					var aColumns = this.getView().byId("TabelaItens").getColumns();
					var aRows = this.getView().byId("TabelaItens").getRows();

					var columns = [];
					var rows = [];

					if (this.getView().byId("btnUltimoPreco").getSelected() === false) {
						for (var i = 0; i < aColumns.length; i++) {
							if (aColumns[i].mProperties.visible === false) {
								aColumns.splice(i, 1);
								i = i - 1;
							}
						}
					}

					for (var i = 0; i < aColumns.length; i++) {
						var label = "";
						for (var j = 0; j < aColumns[i].mAggregations.multiLabels["length"]; j++) {
							label = aColumns[i].mAggregations.multiLabels[j].mProperties.text;
						}
						if (aColumns[i].mAggregations.multiLabels["length"] > 1) {
							if (aColumns[i].mAggregations.multiLabels[0].mProperties.text !== aSupplierName) {
								continue;
							}
						}
						if (aColumns[i].mProperties.visible === true) {
							columns.push(label);
						}
					}

					for (var h = 0; h < aRows.length; h++) {
						var aCells = aRows[h].getCells();
						var line = [];
						if (aCells[2].mProperties.text === "") {
							continue;
						}
						for (var i = 0; i < aColumns.length; i++) {
							if (aColumns[i].mAggregations.multiLabels["length"] > 1) {
								if (aColumns[i].mAggregations.multiLabels[0].mProperties.text !== aSupplierName) {
									continue;
								}
							}
							line.push(aCells[i].mProperties.text);
						}
						rows.push(line);
					}
					return [columns, rows]
				},

				buttonTypeFormatter: function () {
					var sHighestSeverityIcon;
					var aMessages = this.getView().getModel().oData;

					aMessages.forEach(function (sMessage) {
						switch (sMessage.type) {
							case "Error":
								sHighestSeverityIcon = "Negative";
								break;
							case "Warning":
								sHighestSeverityIcon = sHighestSeverityIcon !== "Negative" ? "Critical" : sHighestSeverityIcon;
								break;
							case "Success":
								sHighestSeverityIcon = sHighestSeverityIcon !== "Negative" && sHighestSeverityIcon !== "Critical" ? "Success" : sHighestSeverityIcon;
								break;
							default:
								sHighestSeverityIcon = !sHighestSeverityIcon ? "Neutral" : sHighestSeverityIcon;
								break;
						}
					});

					return sHighestSeverityIcon;
				},

				// Display the number of messages with the highest severity
				highestSeverityMessages: function () {
					var sHighestSeverityIconType = this.buttonTypeFormatter();
					var sHighestSeverityMessageType;

					switch (sHighestSeverityIconType) {
						case "Negative":
							sHighestSeverityMessageType = "Error";
							break;
						case "Critical":
							sHighestSeverityMessageType = "Warning";
							break;
						case "Success":
							sHighestSeverityMessageType = "Success";
							break;
						default:
							sHighestSeverityMessageType = !sHighestSeverityMessageType ? "Information" : sHighestSeverityMessageType;
							break;
					}

					return this.getView().getModel().oData.reduce(function (iNumberOfMessages, oMessageItem) {
						return oMessageItem.type === sHighestSeverityMessageType ? ++iNumberOfMessages : iNumberOfMessages;
					}, 0);
				},

				// Set the button icon according to the message with the highest severity
				buttonIconFormatter: function () {
					var sIcon;
					var aMessages = this.getView().getModel().oData;

					aMessages.forEach(function (sMessage) {
						switch (sMessage.type) {
							case "Error":
								sIcon = "sap-icon://message-error";
								break;
							case "Warning":
								sIcon = sIcon !== "sap-icon://message-error" ? "sap-icon://message-warning" : sIcon;
								break;
							case "Success":
								sIcon = "sap-icon://message-error" && sIcon !== "sap-icon://message-warning" ? "sap-icon://message-success" : sIcon;
								break;
							default:
								sIcon = !sIcon ? "sap-icon://message-information" : sIcon;
								break;
						}
					});

					return sIcon;
				},

				handleMessagePopoverPress: function (oEvent) {
					oMessagePopover.toggle(oEvent.getSource());
				},

				onExportXLS: function () {

					var aCols, aItems, oSettings, oSheet;

					aCols = this.createColumnTreeConfig();
					aItems = this.createDataTreeSource();

					var filename = this.getView().getModel("mcdetails").oData.rfp;
					oSettings = {
						workbook: { columns: aCols },
						dataSource: aItems,
						fileName: filename
					};

					oSheet = new Spreadsheet(oSettings);
					oSheet.build()
						.then(function () {
							MessageToast.show('Excel exportado com sucesso!');
						})
						.finally(function () {
							oSheet.destroy();
						});
				},

				addJSONFormat: function (sInput) {
					return sInput
						.replace(/:\s*"([^"]*)"/g, function (match, p1) {
							return ': "' + p1.replace(/:/g, '@colon@') + '"';
						})
						.replace(/:\s*'([^']*)'/g, function (match, p1) {
							return ': "' + p1.replace(/:/g, '@colon@') + '"';
						})
						.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')
						.replace(/@colon@/g, ':')
				},

				createDataTreeSource: function (iSupplierPath) {
					var aSuppliers = this.getView().getModel("mcdetails").getObject("/suppliers");
					var aItems = this.getModel("itemAnalysis").getData().items;
					var aUITableConfiguration = this.getView().getModel("mcdetails").getObject("/ui5tableconf1");
					var aResults = [];

					var oFloatFormatter =
						new sap.ui.model.type.Float({
							groupingEnabled: true,
							groupingSeparator: ".",
							decimalSeparator: ",",
							minFractionDigits: 2,
							maxFractionDigits: 2
						});

					var oDateFormatter =
						new sap.ui.model.type.Date({
							source: {
								pattern: "yyyyMMdd"
							},
							pattern: "dd/MM/yyyy"
						});

					// Supplier Pricing Grouping
					var aDynamicConfiguration = this.buildDynamicConfiguration(aUITableConfiguration);
					var iItemCounter = -1;

					if (iSupplierPath !== undefined) {
						var oSupplierOut = aSuppliers.find(function (oSupplier) {
							return oSupplier.path === iSupplierPath;
						})
						aSuppliers = [oSupplierOut];
					}

					aItems.forEach(function (oItem) {
						// Static Values
						var oItemOut = JSON.parse(JSON.stringify(oItem));
						iItemCounter++;

						// Initial Conversions
						oItemOut.nodeId = oItemOut.rfqitem;
						oItemOut.quantityStr = oFloatFormatter.formatValue(oItem.quantity, "string");
						oItemOut.lastpopriceStr = oFloatFormatter.formatValue(oItem.lastpoprice, "string");
						oItemOut.lastpodateStr = oDateFormatter.formatValue(oItem.lastpodate, "string");
						oItemOut.vendorStr = oItem.lastposupplierid + " " + oItem.lastposuppliername;
						oItemOut.varStr = window.AnaliseItensVariacaoPreco(oItem.bids, oItem.lastpoprice, aSuppliers);

						// Vendor Values 
						var iSupplierCounter = -1;
						aSuppliers.forEach(function (oSupplier) {
							if (oSupplier != undefined && (iSupplierPath !== undefined || oSupplier.applyCalc) && aDynamicConfiguration[oSupplier.path] !== undefined) {
								var iPropertyCounter = -1;
								if (iSupplierPath === undefined) {
									iSupplierCounter++;
								} else {
									iSupplierCounter = iSupplierPath;
								}

								aDynamicConfiguration[oSupplier.path].forEach(function (oDynamicConfiguration) {
									var sText = oDynamicConfiguration.template.text;
									var sOutput = "";
									var oFormatObject = {};
									iPropertyCounter++;

									// Check the Formatting options
									sText = this.addJSONFormat(sText);
									if (sText.indexOf("formatOptions") > 0) {
										oFormatObject = JSON.parse(sText);
										var sFieldBase = oFormatObject.path.replace("itemAnalysis>", "");
										var sFieldValue = this.getModel("itemAnalysis").getProperty("/items/" + iItemCounter + "/" + sFieldBase);

										switch (oFormatObject.type) {
											case "sap.ui.model.type.Float":
												sOutput = oFloatFormatter.formatValue(sFieldValue, "string");
												break;
											case "sap.ui.model.type.Date":
												sOutput = oDateFormatter.formatValue(sFieldValue, "string");
												break;
											default:
												break;
										}
									} else if (sText.indexOf("formatter") > 0) {
										var sTextProcessing = sText.match(/parts":.+]/)[0];
										var aParts = sTextProcessing.substring(sTextProcessing.search("'")).replace("]", "").split(",");
										var aPartsIn = [];
										aParts.forEach(function (sPart) {
											var sPartIn = $.trim(sPart.replace(/'/g, "").replace("itemAnalysis>", ""));
											if (sPartIn.length > 0) {
												aPartsIn.push(this.getModel("itemAnalysis").getProperty("/items/" + iItemCounter + "/" + sPartIn));
											}
										}.bind(this));

										// Find the Formatter 
										if (aPartsIn.length > 0) {
											var oFormatter = JSON.parse("{" + sText.substring(sText.search(/"formatter"/)));
											aParts = oFormatter.formatter.split(".");
											sOutput = window[aParts[1]].apply(this, aPartsIn);
										}
									} else {
										sText = sText.replace("{itemAnalysis>", "").replace("}", "");
										var sFieldBase = sText;
										sOutput = this.getModel("itemAnalysis").getProperty("/items/" + iItemCounter + "/" + sFieldBase);
									}

									var sFieldOut = "Vendor" + iSupplierCounter + "_Condition" + iPropertyCounter;
									oItemOut[sFieldOut] = sOutput;
								}.bind(this));
							}
						}.bind(this));

						aResults.push(oItemOut);
					}.bind(this));

					return aResults;
				},

				createColumnTreeConfig: function (iSupplierPath) {
					var aSuppliers = this.getView().getModel("mcdetails").getObject("/suppliers");
					var aItems = this.getModel("itemAnalysis").getData().items;
					var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
					var bPriceVisible = this.getModel("Control").getProperty("/AnaliseItem/UltimoPrecoVisivel");
					var aUITableConfiguration = this.getView().getModel("mcdetails").getObject("/ui5tableconf1");
					var aDynamicConfiguration = this.buildDynamicConfiguration(aUITableConfiguration);

					if (iSupplierPath !== undefined) {
						var oSupplierOut = aSuppliers.find(function (oSupplier) {
							return oSupplier.path === iSupplierPath;
						})
						aSuppliers = [oSupplierOut];
					}

					// Static Columns 
					var aColumns = [{ label: oResourceBundle.getText("Mapa_AnalisePorItem_Item"), type: "string", property: "nodeId" },
					{ label: oResourceBundle.getText("Mapa_AnalisePorItem_CodigoMaterial"), type: "string", property: "id" },
					{ label: oResourceBundle.getText("Mapa_AnalisePorItem_Descricao"), type: "string", property: "name" },
					{ label: oResourceBundle.getText("Mapa_AnalisePorItem_IVA"), type: "string", property: "iva" },
					{ label: oResourceBundle.getText("Mapa_AnalisePorItem_Centro"), type: "string", property: "werks" },
					{ label: oResourceBundle.getText("Mapa_AnalisePorItem_Quantidade"), type: "string", property: "quantityStr" },
					{ label: oResourceBundle.getText("Mapa_AnalisePorItem_UnidadeMedida"), type: "string", property: "uom" }];

					// Price Columns
					var aPriceColumns = [{ label: oResourceBundle.getText("Mapa_AnalisePorItem_UltimoPreco"), type: "string", property: "lastpopriceStr" },
					{ label: oResourceBundle.getText("Mapa_AnalisePorItem_UltimoPrecoMoeda"), type: "string", property: "lastpocurrency" },
					{ label: oResourceBundle.getText("Mapa_AnalisePorItem_FornecedorUltimoPreco"), type: "string", property: "vendorStr" },
					{ label: oResourceBundle.getText("Mapa_AnalisePorItem_Data"), type: "string", property: "lastpodateStr" },
					{ label: oResourceBundle.getText("Mapa_AnalisePorItem_CodigoPedidoCompras"), type: "string", property: "lastpoid" }];

					if (bPriceVisible) {
						aColumns = aColumns.concat(aPriceColumns);
					}

					// % Var
					aColumns.push({ label: oResourceBundle.getText("Mapa_AnalisePorItem_PorcentagemVariacao"), type: "string", property: "varStr" });

					// Visible Suppliers
					var iDummyValue = 0;
					var iVisibleSuppliers;
					try {
						iVisibleSuppliers = aSuppliers.reduce((accum, curr) => accum + (curr.applyCalc ? 1 : 0), iDummyValue);
					}
					catch {
						//iVisibleSuppliers = 1;
						return aColumns;
					}

					// Max Conditions 
					var iMaxConditions = aItems.length > 0 && iVisibleSuppliers > 0 ? aItems[0].children[0].children.length : 0;

					if (iMaxConditions > 0) {
						var aItemEntries = aItems[0].children[0].children;

						for (var x = 0; x < aSuppliers.length; x++) {
							var iPath = aSuppliers[x].path;

							if (aSuppliers[x].applyCalc && aDynamicConfiguration[aSuppliers[x].path] !== undefined) {
								for (var y = 0; y < aDynamicConfiguration[aSuppliers[x].path].length; y++) {
									var sColumnIdentifier = "Vendor" + iPath + "_Condition" + y;
									var sLabel = aDynamicConfiguration[aSuppliers[x].path][y].label.replace("{i18n>", "").replace("}", "");
									if (iSupplierPath === undefined) {
										aColumns.push({ label: aSuppliers[x].name + " - " + oResourceBundle.getText(sLabel), type: "string", property: sColumnIdentifier });
									} else {
										aColumns.push({ label: oResourceBundle.getText(sLabel), type: "string", property: sColumnIdentifier });
									}
								}
							}
						}
					}

					return aColumns;
				},

				createColumnConfig: function () {

					var aSuppliers = this.getView().getModel("mcdetails").getObject("/suppliers");
					var aTable = this.getView().byId("TabelaItens").getColumns();
					var data = [];
					for (var i = 0; i < aTable.length; i++) {
						var label = "";
						for (var j = 0; j < aTable[i].mAggregations.multiLabels["length"]; j++) {
							if (label === "") {
								label = aTable[i].mAggregations.multiLabels[j].mProperties.text;
							} else {
								label = label + " - " + aTable[i].mAggregations.multiLabels[j].mProperties.text;
							}
						}

						if (this.getView().byId("TabelaItens").getColumns()[i].mProperties.visible === true) {
							if (this.getView().byId("TabelaItens").getColumns()[i].mAggregations.template.mBindingInfos.text) {
								data.push({
									label: label,
									//property: this.getView().byId("TabelaItens").getColumns()[i].mProperties.filterProperty,
									property: (this.getView().byId("TabelaItens").getColumns()[i].mAggregations.template.mBindingInfos.text.parts[0].path).replace(/\//g, ''),
									type: 'string'
								});
							} else {
								data.push({
									label: label,
									//property: this.getView().byId("TabelaItens").getColumns()[i].mProperties.filterProperty,
									property: (this.getView().byId("TabelaItens").getColumns()[i].mAggregations.template.mBindingInfos.value.parts[0].path).replace(/\//g, ''),
									type: 'string'
								});
							}
						}
					}
					return data;
				},

				createDataSource: function () {

					var aRows = this.getView().byId("TabelaItens").getRows();
					var data = [];
					for (var i = 0; i < aRows.length; i++) {
						var aCells = aRows[i].getCells();
						var line = {}
						for (var j = 0; j < aCells.length; j++) {
							if (aCells[j].mBindingInfos.text) {
								if (aCells[j].mBindingInfos.text.parts.length > 2) {
									line[(aCells[j].mBindingInfos.text.parts[1].path).replace(/\//g, '')] = aCells[j].mProperties.text;
								} else {
									line[(aCells[j].mBindingInfos.text.parts[0].path).replace(/\//g, '')] = aCells[j].mProperties.text;
								}
							} else {
								line[(aCells[j].mBindingInfos.value.parts[0].path).replace(/\//g, '')] = aCells[j].mProperties.text;
							}

						}
						data.push(line);
					}
					return data;
				},


				updateTabelaConfiguracaoFornecedores: function (oSelected) {
					var aItems = this.getView().getModel("mcdetails")
						.getObject("/items");
					var aSuppliers = this.getView()
						.getModel("mcdetails")
						.getObject("/suppliers");
					var aSuppliersCalc = [];
					var nRemoveApplyCalc = 0;
					var nSuppliersWithCalc = 0;
					var nTempItemBidPrice;
					var sTempItemBidSupplier;
					var sTempItemBidSupplierName;
					var nTempItemBidSupplierDate;
					var nTempItemBidSupplierQuoted;
					var nSumAllItemsPrice = 0;
					var nSumAllItemsAwarded = 0;
					var nSumAllItemsLastPOPriceSum = 0;
					var nSumAllItemsLastPOPriceSumAvg = 0;
					var oSuppliersSumCalc = {
						nSumAwarded: 0,
						nSumPrice: 0
					};
					var map;
					for (var i = 0; i < aSuppliers.length; i++) {
						if (aSuppliers[i].applyCalc) {
							nSuppliersWithCalc++;
						}
						map = {
							name: aSuppliers[i].name,
							quoteditems: aSuppliers[i].quoteditems,
							applyCalc: aSuppliers[i].applyCalc,
							awarded: 0,
							quoteprice: 0,
							exclusive: 0,
							lastpopricesum: 0,
							lastpopricesumquoteawardavg: 0,
							lastpopricesumquoteaward: 0
						};
						aSuppliersCalc[aSuppliers[i].id] = map;
					}

					for (var i = 0; i < aItems.length; i++) {
						sTempItemBidSupplier = "";
						sTempItemBidSupplierName = "";
						nTempItemBidSupplierDate = 0;
						nTempItemBidSupplierQuoted = 0;
						nTempItemBidPrice = 0;
						nRemoveApplyCalc = 0;
						var nTotalBids = 0;
						for (var j = 0; j < aItems[i].bids.length; j++) {

							if (aItems[i].bids[j].bidprice == 0 || !aSuppliersCalc[aItems[i].bids[j].supplier].applyCalc) {
								nRemoveApplyCalc++;
								continue;
							}

							if (!!aItems[i].lastpoprice) {
								aSuppliersCalc[aItems[i].bids[j].supplier].lastpopricesum += aItems[i].lastpoprice * aItems[i].quantity;
							} else {
								aSuppliersCalc[aItems[i].bids[j].supplier].lastpopricesum += !!aItems[i].bids[j].bidprice ? (aItems[i].bids[j].bidprice / aItems[
									i].bids[j].por) * aItems[i].quantity : 0;
							}

							if (nTempItemBidPrice == 0) {
								nTempItemBidPrice = aItems[i].bids[j].bidprice / aItems[i].bids[j].por;
								sTempItemBidSupplier = aItems[i].bids[j].supplier;
								sTempItemBidSupplierName = aSuppliersCalc[aItems[i].bids[j].supplier].name;
								nTempItemBidSupplierDate = aItems[i].bids[j].deliverydate;
								nTempItemBidSupplierQuoted = aSuppliersCalc[aItems[i].bids[j].supplier].quoteditems;
							} else if (nTempItemBidPrice > (aItems[i].bids[j].bidprice / aItems[i].bids[j].por)) {
								nTempItemBidPrice = aItems[i].bids[j].bidprice / aItems[i].bids[j].por;
								sTempItemBidSupplier = aItems[i].bids[j].supplier;
								sTempItemBidSupplierName = aSuppliersCalc[aItems[i].bids[j].supplier].name;
								nTempItemBidSupplierDate = aItems[i].bids[j].deliverydate;
								nTempItemBidSupplierQuoted = aSuppliersCalc[aItems[i].bids[j].supplier].quoteditems;
							} else if (nTempItemBidPrice == aItems[i].bids[j].bidprice) {
								// APLICAR CRITERIO
								// DESEMPATE
								// Alem de comparar o
								// pre�o, comparar em
								// ordem os crit�rios de
								// desempate:
								// 2. Delivery date
								// (prazo de entrega em
								// dias)
								// 3. Qtde de itens
								// ofertados por
								// fornecedor
								// 4. Nome do fornecedor
								// (ordem alfabetica)
								if (Number(nTempItemBidSupplierDate) > Number(aItems[i].bids[j].deliverydate)) {
									nTempItemBidPrice = aItems[i].bids[j].bidprice / aItems[i].bids[j].por;
									sTempItemBidSupplier = aItems[i].bids[j].supplier;
									sTempItemBidSupplierName = aSuppliersCalc[aItems[i].bids[j].supplier].name;
									nTempItemBidSupplierDate = aItems[i].bids[j].deliverydate;
									nTempItemBidSupplierQuoted = aSuppliersCalc[aItems[i].bids[j].supplier].quoteditems;
								} else if (nTempItemBidSupplierQuoted < aSuppliersCalc[aItems[i].bids[j].supplier].quoteitems) {
									nTempItemBidPrice = aItems[i].bids[j].bidprice / aItems[i].bids[j].por;
									sTempItemBidSupplier = aItems[i].bids[j].supplier;
									sTempItemBidSupplierName = aSuppliersCalc[aItems[i].bids[j].supplier].name;
									nTempItemBidSupplierDate = aItems[i].bids[j].deliverydate;
									nTempItemBidSupplierQuoted = aSuppliersCalc[aItems[i].bids[j].supplier].quoteditems;
								} else if (sTempItemBidSupplierName
									.localeCompare(aSuppliersCalc[aItems[i].bids[j].supplier].name) >= 0) {
									nTempItemBidPrice = aItems[i].bids[j].bidprice / aItems[i].bids[j].por;
									sTempItemBidSupplier = aItems[i].bids[j].supplier;
									sTempItemBidSupplierName = aSuppliersCalc[aItems[i].bids[j].supplier].name;
									nTempItemBidSupplierDate = aItems[i].bids[j].deliverydate;
									nTempItemBidSupplierQuoted = aSuppliersCalc[aItems[i].bids[j].supplier].quoteditems;
								}
							}

							if (aItems[i].bids[j].bidprice > 0) {
								nTotalBids++;
							}
						}
						if (!!sTempItemBidSupplier) {
							aSuppliersCalc[sTempItemBidSupplier].awarded++;
							aSuppliersCalc[sTempItemBidSupplier].quoteprice = aSuppliersCalc[sTempItemBidSupplier].quoteprice + (nTempItemBidPrice * aItems[i]
								.quantity);
							if (!aItems[i].averageprice) {
								aSuppliersCalc[sTempItemBidSupplier].lastpopricesumquoteaward = aSuppliersCalc[sTempItemBidSupplier].lastpopricesumquoteaward +
									(nTempItemBidPrice * aItems[i].quantity);
							} else {
								aSuppliersCalc[sTempItemBidSupplier].lastpopricesumquoteawardavg = aSuppliersCalc[sTempItemBidSupplier].lastpopricesumquoteawardavg +
									(aItems[i].averageprice * aItems[i].quantity);
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
						this.getView().getModel("mcdetails")
							.setProperty("/items/" + i + "/allbiddersitem", sItems);
					}
					for (var i = 0; i < aSuppliers.length; i++) {

						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/rfpitems", aSuppliersCalc[aSuppliers[i].id].awarded);
						nSumAllItemsAwarded += aSuppliersCalc[aSuppliers[i].id].awarded;
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/awardprice", aSuppliersCalc[aSuppliers[i].id].quoteprice);
						nSumAllItemsPrice += aSuppliersCalc[aSuppliers[i].id].quoteprice;

						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/distawardprice", oSuppliersSumCalc.nSumPrice > 0 ? Math
								.round((aSuppliersCalc[aSuppliers[i].id].quoteprice / oSuppliersSumCalc.nSumPrice) * 100) : 0);
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/distawarditems", oSuppliersSumCalc.nSumAwarded > 0 ? Math
								.round((aSuppliersCalc[aSuppliers[i].id].awarded / oSuppliersSumCalc.nSumAwarded) * 100) : 0);
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/exclusiveitems", aSuppliersCalc[aSuppliers[i].id].exclusive);
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/lastpopricesum", aSuppliersCalc[aSuppliers[i].id].lastpopricesum);
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/lastpopricesumquoteaward", Math
								.round(aSuppliersCalc[aSuppliers[i].id].lastpopricesumquoteaward * 100) / 100);
						this
							.getView()
							.getModel("mcdetails")
							.setProperty("/suppliers/" + aSuppliers[i].path + "/lastpopricesumquoteawardavg", Math
								.round(aSuppliersCalc[aSuppliers[i].id].lastpopricesumquoteawardavg * 100) / 100);
						nSumAllItemsLastPOPriceSum += aSuppliersCalc[aSuppliers[i].id].lastpopricesumquoteaward;
						nSumAllItemsLastPOPriceSumAvg += aSuppliersCalc[aSuppliers[i].id].lastpopricesumquoteawardavg;
					}
					this
						.getView()
						.getModel("Control")
						.setProperty("/AnaliseItem/AwardedPrice", nSumAllItemsPrice);
					this
						.getView()
						.getModel("Control")
						.setProperty("/AnaliseItem/AwardedItems", nSumAllItemsAwarded);
					this
						.getView()
						.getModel("Control")
						.setProperty("/AnaliseItem/LastPOPricesSum", nSumAllItemsLastPOPriceSum);
					this
						.getView()
						.getModel("Control")
						.setProperty("/AnaliseItem/LastPOPricesSumAvg", nSumAllItemsLastPOPriceSumAvg);
					this.updateCommonItems();
					this.updateItemAnalysis();
					//this.FilterTabelaItens(null);							
					if (this.bTableRendered == true) {
						// this.buildHTMLTable();
					}
				},

				FilterTabelaItens: function (oEvent) {
					this.updateDiffItems();
					var oTableItens =
						this.getView().byId("TabelaItens");
					var oBinding = oTableItens.getBinding("rows");
					var aFilters = [];
					switch (this.getView().getModel("Control").getObject("/AnaliseItem/Exibicao")) {
						case "0":
							break;
						case "1": // itens comuns
							aFilters.push(new sap.ui.model.Filter("allbiddersitem", sap.ui.model.FilterOperator.EQ, "1"));
							break;
						case "2": // itens n�o comuns
							aFilters.push(new sap.ui.model.Filter("allbiddersitem", sap.ui.model.FilterOperator.EQ, "2"));
							break;
					};
					switch (this.getView().getModel("Control").getObject("/AnaliseItem/ExibirApenasDivergencia")) {
						case true:
							aFilters.push(new sap.ui.model.Filter("hasdiffitem", sap.ui.model.FilterOperator.EQ, true));
							break;
						case false:
							break;
					}
					oBinding.filter(aFilters);

				},

				FilterArvoreItens: function (oEvent) {
					this.updateDiffItems();
					this.updateItemAnalysis();

					var oItemAnalysis = this.getModel("itemAnalysis").getData();

					var iCounter = 0;
					while (iCounter < oItemAnalysis.items.length) {
						var bDelete = false;
						switch (this.getView().getModel("Control").getObject("/AnaliseItem/Exibicao")) {
							case "0":
								break;
							case "1": // itens comuns
								if (oItemAnalysis.items[iCounter].allbiddersitem !== "1") {
									bDelete = true;
								}
								break;
							case "2": // itens não comuns
								if (oItemAnalysis.items[iCounter].allbiddersitem !== "2") {
									bDelete = true;
								}
								break;
						}

						switch (this.getView().getModel("Control").getObject("/AnaliseItem/ExibirApenasDivergencia")) {
							case true:
								if (!oItemAnalysis.items[iCounter].hasdiffitem) {
									bDelete = true;
								}
								break;
							case false:
								break;
						}

						if (!bDelete) {
							iCounter++;
						} else {
							oItemAnalysis.items.splice(iCounter, 1);
						}
					}

					this.getModel("itemAnalysis").refresh(true);
				},

				formatUnixTimestamp: function (sTimestamp) {
					return new Date(Number(sTimestamp))
						.toLocaleString("pt-BR");
				},

				onSaveMapa: function (oEvent) {
					var oMCDetails = this.getModel("mcdetails").getData();
					var aItemData = this.getModel("itemAnalysis").getData().items;

					oMCDetails.items.forEach(function (oItemOut) {
						var oItemIn = aItemData.find(function (oItemEval) {
							return oItemEval.rfqitem === oItemOut.rfqitem;
						});
						oItemOut.iva = oItemIn.iva;

						// IVA, Incoterms, Payment Terms for Bids								
						oItemOut.bids.forEach(function (oBidOut) {
							["iva", "ncmerp"].forEach(function (sProperty) {
								oBidOut[sProperty] = "";
								oItemIn.children[0].children.forEach(function (oChildren) {
									var oBidIn = oChildren.bids.find(function (oBidEval) {
										return oBidOut.supplier === oBidEval.supplier && oBidEval[sProperty] && oBidEval[sProperty].length > 0;
									});

									var sType = (sProperty === "iva" ? "sap.m.ComboBox" : "sap.m.Input");
									if (oBidIn && oChildren.dynamicConfiguration.template.type === sType) {
										var aBinding = (oChildren.dynamicConfiguration.template.value ? oChildren.dynamicConfiguration.template.value.split("/") : oChildren.dynamicConfiguration.template.text.split("/"));
										var sPropertyEval = aBinding[aBinding.length - 1].replace("}", "");
										if (sPropertyEval === sProperty) {
											oBidOut[sProperty] = oBidIn[sProperty];
										}
									}
								});
							});
						});
					});

					sap.ui.core.BusyIndicator.show(0);
					var sDocument = this.getView().getModel("mcdetails").oData.rfqid;
					$.ajax({
						url: "/sap/bc/zpricemap?rfq=" + sDocument,
						type: "POST",
						data: JSON.stringify(this.getView().getModel("mcdetails").oData),
						traditional: true,
						contentType: "application/json; charset=utf-8",
						success: (data) => {
							this.SaveSucesso(data);
						},
						error: function (e) {
							this.SaveErro(e);
						}
					});
				},
				onCalcImpostos: function (oEvent) {
					var oMCDetails = this.getModel("mcdetails").getData();
					var aItemData = this.getModel("itemAnalysis").getData().items;

					oMCDetails.items.forEach(function (oItemOut) {
						var oItemIn = aItemData.find(function (oItemEval) {
							return oItemEval.rfqitem === oItemOut.rfqitem;
						});
						oItemOut.iva = oItemIn.iva;

						// IVA, Incoterms, Payment Terms for Bids								
						oItemOut.bids.forEach(function (oBidOut) {
							["iva", "ncmerp"].forEach(function (sProperty) {
								oBidOut[sProperty] = "";
								oItemIn.children[0].children.forEach(function (oChildren) {
									var oBidIn = oChildren.bids.find(function (oBidEval) {
										return oBidOut.supplier === oBidEval.supplier && oBidEval[sProperty] && oBidEval[sProperty].length > 0;
									});

									var sType = (sProperty === "iva" ? "sap.m.ComboBox" : "sap.m.Input");
									if (oBidIn && oChildren.dynamicConfiguration.template.type === sType) {
										var aBinding = (oChildren.dynamicConfiguration.template.value ? oChildren.dynamicConfiguration.template.value.split("/") : oChildren.dynamicConfiguration.template.text.split("/"));
										var sPropertyEval = aBinding[aBinding.length - 1].replace("}", "");
										if (sPropertyEval === sProperty) {
											oBidOut[sProperty] = oBidIn[sProperty];
										}
									}
								});
							});
						});
					});

					sap.ui.core.BusyIndicator.show(0);
					var sDocument = this.getView().getModel("mcdetails").oData.rfqid;
					$.ajax({
						url: "/sap/bc/zpricemap?rfq=IMP" + sDocument,
						type: "POST",
						data: JSON.stringify(this.getView().getModel("mcdetails").oData),
						traditional: true,
						contentType: "application/json; charset=utf-8",
						success: (data) => {
							this.onCalcSucess(data);
						},
						error: (e) => {
							this.onCalcErro(e);
						}
					});
				},
				onCalcSucess: function (oData) {
					sap.ui.core.BusyIndicator.hide();
					this.getView().getModel("mcdetails").setJSON(oData);

					//Atualizar mensagens
					var oMessageTemplate = new MessageItem({
						type: '{type}',
						title: '{title}',
						activeTitle: "{active}",
						description: '{description}',
						subtitle: '{subtitle}',
						counter: '{counter}'
					});

					oMessagePopover = new MessagePopover({
						items: {
							path: '/',
							template: oMessageTemplate
						},
						activeTitlePress: function () {
							//MessageToast.show('Active title is pressed');
						}
					});
					var arrMessages = [];
					var returnFromErp = JSON.parse(oData);
					for (var i = 0; i < returnFromErp.suppliers.length; i++) {
						if (returnFromErp.suppliers[i].hasOwnProperty("messages")) {
							arrMessages = returnFromErp.suppliers[i].messages;
							break;
						}
					}
					var arrMessagesShow = [];
					for (var i = 0; i < arrMessages.length; i++) {
						if (arrMessages[i].type == 'E') {
							arrMessages[i].type = 'Error';
							arrMessagesShow.push(arrMessages[i]);
						}
						/*else if (arrMessages[i].type == 'S'){								
							arrMessages[i].type = 'Success';
						}
						else if (arrMessages[i].type == 'W'){								
							arrMessages[i].type = 'Warning';
						}
						else if (arrMessages[i].type == 'I'){								
							arrMessages[i].type = 'Information';
						}
						else if (arrMessages[i].type == 'A'){								
							arrMessages[i].type = 'Information';
						}*/
					}
					var oModel = new JSONModel();
					oModel.setData(arrMessagesShow);
					this.getView().setModel(oModel);
					this.byId("messagePopoverBtn").addDependent(oMessagePopover);

					//this.updateItemAnalysis();
					this.updateTabelaConfiguracaoFornecedores();
					if (arrMessagesShow.length > 0) {
						MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("Mapa_CalcComLog"));
					}
					else {
						MessageBox.success(this.getView().getModel("i18n").getResourceBundle().getText("Mapa_CalcOK"));
					}
				},
				onCalcErro: function (oEvent) {
					sap.ui.core.BusyIndicator.hide();
					MessageBox.success(this.getView().getModel("i18n").getResourceBundle().getText("Mapa_CalcErro"));
				},
				SaveSucesso: function (oEvent) {
					sap.ui.core.BusyIndicator.hide();
					MessageBox.success(this.getView().getModel("i18n").getResourceBundle().getText("Mapa_SaveOK"));
				},
				SaveErro: function (oEvent) {
					sap.ui.core.BusyIndicator.hide();
					MessageBox.success(this.getView().getModel("i18n").getResourceBundle().getText("Mapa_SaveErro"));
				},
				onChangeLanguage: function (oEvent) {
					var sSelectedLang = oEvent
						.getParameters("selectedItem").selectedItem
						.getKey();
					sap.ui.getCore().getConfiguration()
						.setLanguage(sSelectedLang);
				}

			});
	});