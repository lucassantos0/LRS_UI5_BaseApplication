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
					
					debugger;
//		            var oModelTable = {
//		                    ColumnsId : this.ItemColumns.oData.columns,
//		                    Data : this.ItemColumns.oData.rows
//		                };
//		            
//					var oTable = this.byId("tableItems");  
//					var oModel = new sap.ui.model.json.JSONModel(oModelTable);
//					oTable.setModel(oModel);
//					oTable.bindAggregation("columns", "/ColumnsId", new sap.m.Column({
//			            hAlign : "{halign}",
//			            width : "{width}",
//			            visible: "{visible}",
//			            header : new sap.m.Text({
//			                text : "{text}"
//			            }),
//			            styleClass:"{style}"
//			        }));
//	   			    
//				    oTable.bindItems("/Data", function(index, context) {
//				        var obj = context.getObject();
//				        var row = new sap.m.ColumnListItem();
//				        for(var k in obj) {	
//				        	var diver = "div" + k; 
//				        	if(obj[diver] == "X"){
//				        		
//				        		row.addCell(new sap.m.HBox({
//				        						width:"100%",
//				        						justifyContent : sap.m.FlexJustifyContent.SpaceAround,
//				        						items: [    new sap.m.Text({text : obj[k]}),
//				        							new sap.ui.core.Icon({ src : "sap-icon://color-fill",
//				        												   color : "#f33334"})
//				        							  ]
//				            }));	
//				            
//				        	}else{
//				        		row.addCell(new sap.m.Text({text : obj[k]}));
//				        	}
//				        }
//				        return row;
//				    });	
				    
				}		
			
			});
});
