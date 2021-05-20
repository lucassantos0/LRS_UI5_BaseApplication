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
		if (aBids[i].isservice == 'X'){
        	nLowestBidPrice = 0;
        	continue;
        }
		aBids[i].bidprice = Number(aBids[i].bidprice);
		if (!nLowestBidPrice || nLowestBidPrice > ( aBids[i].bidprice / aBids[i].por )) {
			// check if supplier has applyCalc property enabled;
			bSupplierCalcEnabled = false;
			if (aSuppliers.length > 0 && aSuppliers[0] != undefined){
				for (var j = 0; j < aSuppliers.length; j++) {
					if (aBids[i].supplier == aSuppliers[j].id) {
						bSupplierCalcEnabled = aSuppliers[j].applyCalc;
					}
				}
			}
			if (!!bSupplierCalcEnabled) {
				nLowestBidPrice = ( aBids[i].bidprice / aBids[i].por );
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
		if (aBids[i].isservice == 'X'){
        	nLowestBidPrice = 0;
        	continue;
        }
		aBids[i].bidprice = Number(aBids[i].bidprice);
		if (!nLowestBidPrice || nLowestBidPrice > ( aBids[i].bidprice / aBids[i].por )) {
			// check if supplier has applyCalc property enabled;
			bSupplierCalcEnabled = false;
			for (var j = 0; j < aSuppliers.length; j++) {
				if (aBids[i].supplier == aSuppliers[j].id) {
					bSupplierCalcEnabled = aSuppliers[j].applyCalc;
				}
			}
			if (!!bSupplierCalcEnabled) {
				nLowestBidPrice = ( aBids[i].bidprice / aBids[i].por );
			}
		}
	}
	if (nLowestBidPrice == 0) { return "None"; }
	return nLastPoPrice > nLowestBidPrice ? "Success" : "Error";
};

window.CheckBestBidPrice = function(oBid, aBids, aSuppliers) {
	if (!oBid) { return "None"; }
	if (oBid.bidprice == 0){ return "None"; }
	if (!aBids){ return "None"; }
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
		try{
			if (aBids[i].bidprice == 0 || !aSuppliersCalc[aBids[i].supplier].applyCalc) {
				continue; // If supplier not considered in calculation - skip
			}
		}catch(e){
			continue;
		}
		// Check if supplier surpass the current Bid check criteria
		if (( aBids[i].bidprice / aBids[i].por ) < ( oBid.bidprice / oBid.por) ) {
			return "None"; // 1. If current bid is not best price
		} else if ((aBids[i].bidprice / aBids[i].por ) == ( oBid.bidprice / oBid.por)) {
			if(aSuppliersCalc[aBids[i].supplier].quoteditems > aSuppliersCalc[oBid.supplier].quoteditems){ 
					return "None"; // 3. If current bid supplier has less
									// quoteditems than comparison
				} else if(aSuppliersCalc[aBids[i].supplier].quoteditems == aSuppliersCalc[oBid.supplier].quoteditems){
					if(aSuppliersCalc[aBids[i].supplier].name.localeCompare(aSuppliersCalc[oBid.supplier].name) < 0){
						return "None"; // 4. Alphabetically ordered
					}
				}
			
		}
	}
	return "Success";
};
window.CheckBestTotalEfetIcon = function(oBid, aBids, aSuppliers) {
	if (!oBid) { return ""; } 
	if (oBid.precototaleftv == 0){ return ""; }
	if (!aBids){ return ""; }
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
		try{
			if (aBids[i].precototaleftv == 0 || !aSuppliersCalc[aBids[i].supplier].applyCalc) {
				continue; // If supplier not considered in calculation - skip
			}
		}catch(e){
			continue;
		}
		// Check if supplier surpass the current Bid check criteria
		if ( ( aBids[i].precototaleftv / aBids[i].por ) < ( oBid.precototaleftv / oBid.por ) ) {
			return ""; // 1. If current bid is not best price
		} 
	}
	return "sap-icon://flag";
};

window.CheckBestTotalEfetPrice = function(oBid, aBids, aSuppliers) {
	if (!oBid) { return "None"; }
	if (oBid.precototaleftv == 0){ return "None"; }
	if (!aBids){ return "None"; }
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
		try{
			if (aBids[i].precototaleftv == 0 || !aSuppliersCalc[aBids[i].supplier].applyCalc) {
				continue; // If supplier not considered in calculation - skip
			}
		}catch(e){
			continue;
		}
		// Check if supplier surpass the current Bid check criteria
		if (( aBids[i].precototaleftv / aBids[i].por ) < ( oBid.precototaleftv / oBid.por) ) {
			return "None"; // 1. If current bid is not best price
		} else if ((aBids[i].precototaleftv / aBids[i].por ) == ( oBid.precototaleftv / oBid.por)) {
			if(aSuppliersCalc[aBids[i].supplier].quoteditems > aSuppliersCalc[oBid.supplier].quoteditems){ 
					return "None"; // 3. If current bid supplier has less
									// quoteditems than comparison
				} else if(aSuppliersCalc[aBids[i].supplier].quoteditems == aSuppliersCalc[oBid.supplier].quoteditems){
					if(aSuppliersCalc[aBids[i].supplier].name.localeCompare(aSuppliersCalc[oBid.supplier].name) < 0){
						return "None"; // 4. Alphabetically ordered
					}
				}
			
		}
	}
	return "Success";
};
window.CheckBestBidPriceIcon = function(oBid, aBids, aSuppliers) {
	if (!oBid) { return ""; } 
	if (oBid.bidprice == 0){ return ""; }
	if (!aBids){ return ""; }
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
		try{
			if (aBids[i].bidprice == 0 || !aSuppliersCalc[aBids[i].supplier].applyCalc) {
				continue; // If supplier not considered in calculation - skip
			}
		}catch(e){
			continue;
		}
		// Check if supplier surpass the current Bid check criteria
		if ( ( aBids[i].bidprice / aBids[i].por ) < ( oBid.bidprice / oBid.por ) ) {
			return ""; // 1. If current bid is not best price
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
			// for each item, iterate through the bids - here check if the
			// lowest
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
				nTempItemBidPrice = ( aItems[i].bids[j].bidprice / aItems[i].bids[j].por );
				sTempItemBidSupplier = aItems[i].bids[j].supplier;
			} else if (nTempItemBidPrice > ( aItems[i].bids[j].bidprice / aItems[i].bids[j].por ) ) {
				nTempItemBidPrice = ( aItems[i].bids[j].bidprice / aItems[i].bids[j].por );
				sTempItemBidSupplier = aItems[i].bids[j].supplier;
			}
		}
		if (sTempItemBidSupplier == sSupplierId) {
			nItemsSum++;
		}
	}
	return nItemsSum;
};

window.PrintTotalValue = function(nBidPrice, nQuantity, nPor) {
	if (!nBidPrice) { return ""; }
	return window.FormatCurrency(((nBidPrice / nPor ) * nQuantity).toFixed(2));
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

window.AnaliseItensPosicao = function(oBid, aBids, aSuppliers) {	
	if (!aBids) { return ""; }
	if (!oBid){ return ""; }
	var map;
	var aBidArray = []; 
	var bSupplierCalcEnabled = false;
	for (var i = 0; i < aBids.length; i++) {
		for (var j = 0; j < aSuppliers.length; j++) {
			if (aBids[i].supplier == aSuppliers[j].id) {
				bSupplierCalcEnabled = aSuppliers[j].applyCalc;
			}
		}
		if (!!bSupplierCalcEnabled) {			
		map =
		{
		  bid : aBids[i].bidprices,
		  supplier : aBids[i].supplier,
		  
		};
		aBidArray[[i]] = map;
		}
	}
	aBidArray.sort();
	for (var i = 0; i < aBidArray.length; i++) {
		if(oBid.bidprices === aBidArray[i].bid){
			return i + 1;
		}
	}

};

window.DifMelhor = function(aBids, nQuant, nActualBid, aSuppliers) {
	var nReturn = "";
	var nLowestBidPrice = 0;
	var bSupplierCalcEnabled = false;
	nActualBid = Number(nActualBid);
	if (!aBids) { return ""; }
	if (nActualBid == 0) { return ""; }
	for (var i = 0; i < aBids.length; i++) {
		aBids[i].bidprices = Number(aBids[i].bidprices);
		if (!nLowestBidPrice || nLowestBidPrice > ( aBids[i].bidprices / aBids[i].por )) {
			// check if supplier has applyCalc property enabled;
			bSupplierCalcEnabled = false;
			for (var j = 0; j < aSuppliers.length; j++) {
				if (aBids[i].supplier == aSuppliers[j].id) {
					bSupplierCalcEnabled = aSuppliers[j].applyCalc;
				}
			}
			if (!!bSupplierCalcEnabled) {
				nLowestBidPrice = ( aBids[i].bidprices / aBids[i].por );
			}
		}
	}
	if (nLowestBidPrice == 0) { return ""; }
	
	if (nLowestBidPrice == nActualBid) { return "0"; }

	nReturn = ( ( 1 - ( nLowestBidPrice / nActualBid ) ).toFixed(2) ) * 100;
	nReturn = nReturn.toFixed();
	return nReturn + '%';
};

window.CompareDiffPricesState = function(sVal1, sVal2) {
	if (sVal1 !== sVal2) {
		return "Error";
	} else {
		return "None";
	}
};

window.FormatValuePdf = function (value) {
    return (value).toLocaleString(undefined, {
	  minimumFractionDigits: 2,
	  maximumFractionDigits: 2
	})
};