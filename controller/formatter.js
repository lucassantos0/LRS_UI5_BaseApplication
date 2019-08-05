window.FormatCurrency = function(amount) {
	var oCurrency = new sap.ui.model.type.Currency(
	{
	  decimalSeparator : ',',
	  groupingSeparator : '.',
	  showMeasure : false
	});
	return oCurrency.formatValue(
	[ amount, "BRL" ], "string");
};

window.AnaliseItensVariacaoPreco = function(aBids, nLastPoPrice, aSuppliers) {
	var nLowestBidPrice = 0;
	var bSupplierCalcEnabled = false;
	nLastPoPrice = Number(nLastPoPrice);
	if (!aBids) { return ""; }
	if (nLastPoPrice == 0) { return ""; }
	for (var i = 0; i < aBids.length; i++) {
		aBids[i].bidprice = Number(aBids[i].bidprice);
		if (!nLowestBidPrice || nLowestBidPrice > aBids[i].bidprice) {
			// check if supplier has applyCalc property enabled;
			bSupplierCalcEnabled = false;
			for (var j = 0; j < aSuppliers.length; j++) {
				if (aBids[i].supplier == aSuppliers[j].id) {
					bSupplierCalcEnabled = aSuppliers[j].applyCalc;
				}
			}
			if (!!bSupplierCalcEnabled) {
				nLowestBidPrice = aBids[i].bidprice;
			}
		}
	}
	if (nLowestBidPrice == 0) { return ""; }

	nLowestBidPrice = nLastPoPrice > nLowestBidPrice ? Math.round(((nLastPoPrice - nLowestBidPrice) / nLowestBidPrice) * 100) : Math
	    .round(((nLowestBidPrice - nLastPoPrice) / nLastPoPrice) * 100)
	    * -1;
	return Math.round(nLowestBidPrice * 100) / 100;
};

window.AnaliseItensVariacaoPrecoState = function(aBids, nLastPoPrice, aSuppliers) {
	var nLowestBidPrice = 0;
	var bSupplierCalcEnabled = false;
	nLastPoPrice = Number(nLastPoPrice);
	if (!aBids) { return "None"; }
	if (nLastPoPrice == 0) { return "None"; }
	for (var i = 0; i < aBids.length; i++) {
		aBids[i].bidprice = Number(aBids[i].bidprice);
		if (!nLowestBidPrice || nLowestBidPrice > aBids[i].bidprice) {
			// check if supplier has applyCalc property enabled;
			bSupplierCalcEnabled = false;
			for (var j = 0; j < aSuppliers.length; j++) {
				if (aBids[i].supplier == aSuppliers[j].id) {
					bSupplierCalcEnabled = aSuppliers[j].applyCalc;
				}
			}
			if (!!bSupplierCalcEnabled) {
				nLowestBidPrice = aBids[i].bidprice;
			}
		}
	}
	if (nLowestBidPrice == 0) { return "None"; }
	return nLastPoPrice > nLowestBidPrice ? "Success" : "Error";
};

window.CheckBestBidPrice = function(oBid, aBids, aSuppliers) {
	if (!oBid) { return "None"; }
	if (oBid.bidprice == 0){ return "None"; }
	var bIsBidBest = false;
	var map;
	var aSuppliersCalc = []; 
	for (var i = 0; i < aSuppliers.length; i++) {
		map =
		{
		  name : aSuppliers[i].name,
		  quoteditems : aSuppliers[i].quoteditems,
		  applyCalc : aSuppliers[i].applyCalc
		};
		aSuppliersCalc[aSuppliers[i].id] = map;
	}
	for (var i = 0; i < aBids.length; i++) { 
		if (aBids[i].supplier == oBid.supplier) {
			continue; // If same supplier - skip
		}
		if (aBids[i].bidprice == 0 || !aSuppliersCalc[aBids[i].supplier].applyCalc) {
			continue; // If supplier not considered in calculation - skip
		}
		// Check if supplier surpass the current Bid check criteria
		if (aBids[i].bidprice < oBid.bidprice) {
			return "None"; // 1. If current bid is not best price
		} else if (aBids[i].bidprice == oBid.bidprice) {
			if (aBids[i].deliverydate < oBid.deliverydate) {
				return "None"; // 2. If current bid is not the quickest
			} else if (aBids[i].deliverydate == oBid.deliverydate) {
				if(aSuppliersCalc[aBids[i].supplier].quoteditems > aSuppliersCalc[oBid.supplier].quoteditems){ 
					return "None"; //3. If current bid supplier has less quoteditems than comparison
				} else if(aSuppliersCalc[aBids[i].supplier].quoteditems == aSuppliersCalc[oBid.supplier].quoteditems){
					if(aSuppliersCalc[aBids[i].supplier].name.localeCompare(aSuppliersCalc[oBid.supplier].name) < 0){
						return "None"; //4. Alphabetically ordered
					}
				}
			}
		}
	}
	return "Success";
};
window.CheckBestBidPriceIcon = function(oBid, aBids, aSuppliers) {
	if (!oBid) { return ""; } 
	if (oBid.bidprice == 0){ return ""; }
	var bIsBidBest = false;
	var map;
	var aSuppliersCalc = []; 
	for (var i = 0; i < aSuppliers.length; i++) {
		map =
		{
		  name : aSuppliers[i].name,
		  quoteditems : aSuppliers[i].quoteditems,
		  applyCalc : aSuppliers[i].applyCalc
		};
		aSuppliersCalc[aSuppliers[i].id] = map;
	}
	for (var i = 0; i < aBids.length; i++) {
		if (aBids[i].supplier == oBid.supplier) {
			continue; // If same supplier - skip
		}
		if (aBids[i].bidprice == 0 || !aSuppliersCalc[aBids[i].supplier].applyCalc) {
			continue; // If supplier not considered in calculation - skip
		}
		// Check if supplier surpass the current Bid check criteria
		if (aBids[i].bidprice < oBid.bidprice) {
			return ""; // 1. If current bid is not best price
		} else if (aBids[i].bidprice == oBid.bidprice) {
			if (aBids[i].deliverydate < oBid.deliverydate) {
				return ""; // 2. If current bid is not the quickest
			} else if (aBids[i].deliverydate == oBid.deliverydate) {
				if(aSuppliersCalc[aBids[i].supplier].quoteditems > aSuppliersCalc[oBid.supplier].quoteditems){ 
					return ""; //3. If current bid supplier has less quoteditems than comparison
				} else if(aSuppliersCalc[aBids[i].supplier].quoteditems == aSuppliersCalc[oBid.supplier].quoteditems){
					if(aSuppliersCalc[aBids[i].supplier].name.localeCompare(aSuppliersCalc[oBid.supplier].name) < 0){
						return ""; //4. Alphabetically ordered
					}
				}
			}
		}
	}
	return "sap-icon://flag";
};

window.SomatorioItensVencidos = function(bApplyCalc, sSupplierId, aItems, aSuppliers) {
	var nItemsSum = 0;
	var nTempItemBidPrice;
	var sTempItemBidSupplier;
	var bSupplierCalcEnabled;
	for (var i = 0; i < aItems.length; i++) {
		// iterate through all items
		nTempItemBidPrice = 0;
		sTempItemBidSupplier = "";
		for (var j = 0; j < aItems[i].bids.length; j++) {
			// for each item, iterate through the bids - here check if the lowest
			// bidPrice belongs to sSupplierId (bid[x].supplier)
			bSupplierCalcEnabled = false;
			for (var k = 0; k < aSuppliers.length; k++) {
				if (aItems[i].bids[j].supplier == aSuppliers[k].id) {
					bSupplierCalcEnabled = aSuppliers[k].applyCalc;
				}
			}
			if (!bSupplierCalcEnabled) {
				continue;
			}
			if (nTempItemBidPrice == 0) {
				nTempItemBidPrice = aItems[i].bids[j].bidprice;
				sTempItemBidSupplier = aItems[i].bids[j].supplier;
			} else if (nTempItemBidPrice > aItems[i].bids[j].bidprice) {
				nTempItemBidPrice = aItems[i].bids[j].bidprice;
				sTempItemBidSupplier = aItems[i].bids[j].supplier;
			}
		}
		if (sTempItemBidSupplier == sSupplierId) {
			nItemsSum++;
		}
	}
	return nItemsSum;
};

window.PrintTotalValue = function(nBidPrice, nQuantity) {
	if (!nBidPrice) { return ""; }
	return window.FormatCurrency((nBidPrice * nQuantity).toFixed(2));
};

window.CompareDiffPricesText = function(sVal1, sVal2) {
	if (!!sVal1 && !sVal2 && sVal2 != 0) {
		return sVal1 + " / -";
	} else if (!sVal1 && !!sVal2 && sVal1 != 0) {
		return "- / " + sVal2;
	} else if ((!!sVal1 && !!sVal2)) {
		return sVal1 + " / " + sVal2;
	} else {
		return sVal1 + " / " + sVal2;
	}
};

window.CompareDiffPricesState = function(sVal1, sVal2) {
	if (sVal1 !== sVal2) {
		return "Error";
	} else {
		return "None";
	}
};
