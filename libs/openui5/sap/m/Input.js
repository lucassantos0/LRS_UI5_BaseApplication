/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./InputBase','./Popover','sap/ui/core/Item','./ColumnListItem','./GroupHeaderListItem','./StandardListItem','sap/ui/core/SeparatorItem','./List','./Table','./library','sap/ui/core/IconPool','sap/ui/Device','sap/ui/core/Control','./SuggestionsPopover','./Toolbar','./ToolbarSpacer','./Button',"sap/ui/dom/containsOrEquals","sap/base/assert","sap/base/util/deepEqual","sap/m/inputUtils/wordStartsWithValue","sap/m/inputUtils/inputsDefaultFilter","sap/m/inputUtils/highlightDOMElements","./InputRenderer","sap/ui/base/ManagedObject","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/selectText"],function(I,P,a,C,G,S,b,L,T,l,c,D,d,e,f,g,B,h,j,k,w,m,n,o,M,q){"use strict";var p=l.ListType;var r=l.InputTextFormatMode;var s=l.InputType;var t=l.ListMode;var u=l.ListSeparators;var v=I.extend("sap.m.Input",{metadata:{library:"sap.m",properties:{type:{type:"sap.m.InputType",group:"Data",defaultValue:s.Text},maxLength:{type:"int",group:"Behavior",defaultValue:0},dateFormat:{type:"string",group:"Misc",defaultValue:'YYYY-MM-dd',deprecated:true},showValueHelp:{type:"boolean",group:"Behavior",defaultValue:false},valueHelpIconSrc:{type:"sap.ui.core.URI",group:"Behavior",defaultValue:"sap-icon://value-help"},showSuggestion:{type:"boolean",group:"Behavior",defaultValue:false},valueHelpOnly:{type:"boolean",group:"Behavior",defaultValue:false},filterSuggests:{type:"boolean",group:"Behavior",defaultValue:true},maxSuggestionWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},startSuggestion:{type:"int",group:"Behavior",defaultValue:1},showTableSuggestionValueHelp:{type:"boolean",group:"Behavior",defaultValue:true},description:{type:"string",group:"Misc",defaultValue:null},fieldWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:'50%'},valueLiveUpdate:{type:"boolean",group:"Behavior",defaultValue:false},selectedKey:{type:"string",group:"Data",defaultValue:""},textFormatMode:{type:"sap.m.InputTextFormatMode",group:"Misc",defaultValue:r.Value},textFormatter:{type:"any",group:"Misc",defaultValue:""},suggestionRowValidator:{type:"any",group:"Misc",defaultValue:""},enableSuggestionsHighlighting:{type:"boolean",group:"Behavior",defaultValue:true},autocomplete:{type:"boolean",group:"Behavior",defaultValue:true}},defaultAggregation:"suggestionItems",aggregations:{suggestionItems:{type:"sap.ui.core.Item",multiple:true,singularName:"suggestionItem"},suggestionColumns:{type:"sap.m.Column",multiple:true,singularName:"suggestionColumn",bindable:"bindable",forwarding:{getter:"_getSuggestionsTable",aggregation:"columns"}},suggestionRows:{type:"sap.m.ColumnListItem",altTypes:["sap.m.GroupHeaderListItem"],multiple:true,singularName:"suggestionRow",bindable:"bindable",forwarding:{getter:"_getSuggestionsTable",aggregation:"items"}},_suggestionPopup:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_valueHelpIcon:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}},associations:{selectedItem:{type:"sap.ui.core.Item",multiple:false},selectedRow:{type:"sap.m.ColumnListItem",multiple:false}},events:{liveChange:{parameters:{value:{type:"string"},escPressed:{type:"boolean"},previousValue:{type:"string"}}},valueHelpRequest:{parameters:{fromSuggestions:{type:"boolean"}}},suggest:{parameters:{suggestValue:{type:"string"},suggestionColumns:{type:"sap.m.ListBase"}}},suggestionItemSelected:{parameters:{selectedItem:{type:"sap.ui.core.Item"},selectedRow:{type:"sap.m.ColumnListItem"}}},submit:{parameters:{value:{type:"string"}}}},designtime:"sap/m/designtime/Input.designtime"}});c.insertFontFaceStyle();v._DEFAULTFILTER_TABULAR=function(V,x){var y=x.getCells(),i=0;for(;i<y.length;i++){if(y[i].getText){if(w(y[i].getText(),V)){return true;}}}return false;};v._DEFAULTRESULT_TABULAR=function(x){var y=x.getCells(),i=0;for(;i<y.length;i++){if(y[i].getText){return y[i].getText();}}return"";};v.prototype.init=function(){I.prototype.init.call(this);this._fnFilter=m;this._bFullScreen=D.system.phone;this._iSetCount=0;this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.m");};v.prototype.exit=function(){I.prototype.exit.call(this);this._deregisterEvents();this.cancelPendingSuggest();if(this._iRefreshListTimeout){clearTimeout(this._iRefreshListTimeout);this._iRefreshListTimeout=null;}if(this._oSuggestionTable){this._oSuggestionTable.destroy();this._oSuggestionTable=null;}if(this._oSuggPopover){this._oSuggPopover.destroy();this._oSuggPopover=null;}if(this._oShowMoreButton){this._oShowMoreButton.destroy();this._oShowMoreButton=null;}if(this._oButtonToolbar){this._oButtonToolbar.destroy();this._oButtonToolbar=null;}this.$().off("click");};v.prototype.onBeforeRendering=function(){var i=this.getSelectedKey(),x=this.getShowValueHelp()&&this.getEnabled()&&this.getEditable(),E=this.getAggregation("_endIcon")||[],y=E[0],z,A=this._isSuggestionsPopoverOpen(),V=A?this._oSuggPopover._getValueStateHeader().getText():null,F=A?this._oSuggPopover._getValueStateHeader().getValueState():"";I.prototype.onBeforeRendering.call(this);this._deregisterEvents();if(i){this.setSelectedKey(i);}if(this.getShowSuggestion()){this._oSuggPopover._bAutocompleteEnabled=this.getAutocomplete();if(this.getShowTableSuggestionValueHelp()){this._addShowMoreButton();}else{this._removeShowMoreButton();}z=this._oSuggPopover._oPopupInput;if(z){z.setType(this.getType());}}if(x){y=this._getValueHelpIcon();y.setProperty("visible",true,true);}else if(y){y.setProperty("visible",false,true);}if(!this.getWidth()){this.setProperty("width","100%",true);}if(this._oSuggPopover){this._oSuggPopover._resetTypeAhead();}if(A&&((this.getValueStateText()&&V!==this.getValueStateText())||(this.getValueState()!==F)||(this.getFormattedValueStateText()))){this._updateSuggestionsPopoverValueState();}};v.prototype._getDisplayText=function(i){var x=this.getTextFormatter();if(x){return x(i);}var y=i.getText(),K=i.getKey(),z=this.getTextFormatMode();switch(z){case r.Key:return K;case r.ValueKey:return y+' ('+K+')';case r.KeyValue:return'('+K+') '+y;default:return y;}};v.prototype._onValueUpdated=function(i){if(this._bSelectingItem||i===this._sSelectedValue){return;}var K=this.getSelectedKey(),H;if(K===''){return;}if(this._hasTabularSuggestions()){H=this._oSuggestionTable&&!!this._oSuggestionTable.getSelectedItem();}else{H=this._oSuggPopover._oList&&!!this._oSuggPopover._oList.getSelectedItem();}if(H){return;}this.setProperty("selectedKey",'',true);this.setAssociation("selectedRow",null,true);this.setAssociation("selectedItem",null,true);this.fireSuggestionItemSelected({selectedItem:null,selectedRow:null});};v.prototype._updateSelectionFromList=function(){if(this._oSuggPopover._iPopupListSelectedIndex<0){return false;}var i=this._oSuggPopover._oList.getSelectedItem();if(i){if(this._hasTabularSuggestions()){this.setSelectionRow(i,true);}else{this.setSelectionItem(i._oItem,true);}}return true;};v.prototype.setSelectionItem=function(i,x){this._bSelectingItem=true;if(!i){this.setAssociation("selectedItem",null,true);this.setValue('');return;}this._oSuggPopover._iPopupListSelectedIndex=-1;var y=this._iSetCount,N;this.setAssociation("selectedItem",i,true);this.setProperty("selectedKey",i.getKey(),true);if(x){this.fireSuggestionItemSelected({selectedItem:i});}if(y!==this._iSetCount){N=this.getValue();}else{N=this._getDisplayText(i);}this._sSelectedValue=N;this.updateInputField(N);if(this.bIsDestroyed){return;}if(!(this.isMobileDevice()&&this instanceof sap.m.MultiInput)){this._closeSuggestionPopup();}this._bSelectingItem=false;};v.prototype.addSuggestionRowGroup=function(i,H,x){H=H||new G({title:M.escapeSettingsValue(i.text)||M.escapeSettingsValue(i.key)});this.addAggregation("suggestionRows",H,x);return H;};v.prototype.addSuggestionItemGroup=function(i,H,x){H=H||new b({text:M.escapeSettingsValue(i.text)||M.escapeSettingsValue(i.key)});this.addAggregation("suggestionItems",H,x);return H;};v.prototype.setSelectedItem=function(i){if(typeof i==="string"){i=sap.ui.getCore().byId(i);}if(i!==null&&!(i instanceof a)){return this;}this.setSelectionItem(i);return this;};v.prototype.setSelectedKey=function(K){K=this.validateProperty("selectedKey",K);this.setProperty("selectedKey",K,true);if(this._hasTabularSuggestions()){return this;}if(!K){this.setSelectionItem();return this;}var i=this.getSuggestionItemByKey(K);this.setSelectionItem(i);return this;};v.prototype.getSuggestionItemByKey=function(K){var x=this.getSuggestionItems()||[],y,i;for(i=0;i<x.length;i++){y=x[i];if(y.getKey()===K){return y;}}};v.prototype._getFormattedValueStateText=function(){var i=this._isSuggestionsPopoverOpen(),V=i?this._oSuggPopover._getValueStateHeader().getFormattedText():null;if(i&&V){return V;}else{return I.prototype.getFormattedValueStateText.call(this);}};v.prototype.setSelectionRow=function(i,x){if(!i){this.setAssociation("selectedRow",null,true);return;}this._oSuggPopover._iPopupListSelectedIndex=-1;this._bSelectingItem=true;var y,z=this.getSuggestionRowValidator();if(z){y=z(i);if(!(y instanceof a)){y=null;}}var A=this._iSetCount,K="",N;this.setAssociation("selectedRow",i,true);if(y){K=y.getKey();}this.setProperty("selectedKey",K,true);if(x){this.fireSuggestionItemSelected({selectedRow:i});}if(A!==this._iSetCount){N=this.getValue();}else{if(y){N=this._getDisplayText(y);}else{N=this._fnRowResultFilter?this._fnRowResultFilter(i):e._DEFAULTRESULT_TABULAR(i);}}this._sSelectedValue=N;this.updateInputField(N);if(this.bIsDestroyed){return;}if(!(this.isMobileDevice()&&this instanceof sap.m.MultiInput&&this._isMultiLineMode)){this._closeSuggestionPopup();}this._bSelectingItem=false;};v.prototype.setSelectedRow=function(i){if(typeof i==="string"){i=sap.ui.getCore().byId(i);}if(i!==null&&!(i instanceof C)){return this;}this.setSelectionRow(i);return this;};v.prototype._getValueHelpIcon=function(){var i=this,E=this.getAggregation("_endIcon")||[],x=this.getValueHelpIconSrc(),V=E[0];if(!V){V=this.addEndIcon({id:this.getId()+"-vhi",src:x,useIconTooltip:false,alt:this._oRb.getText("INPUT_VALUEHELP_BUTTON"),decorative:false,noTabStop:true,press:function(y){if(!i.getValueHelpOnly()){var z=this.getParent(),$;if(D.support.touch){$=z.$('inner');$.attr('readonly','readonly');z.focus();$.removeAttr('readonly');}else{z.focus();}i.bValueHelpRequested=true;i._fireValueHelpRequest(false);}}});}else if(V.getSrc()!==x){V.setSrc(x);}return V;};v.prototype._fireValueHelpRequest=function(F){var i="";if(this.getShowSuggestion()&&this._oSuggPopover){i=this._oSuggPopover._sTypedInValue||"";}else{i=this.getDOMValue();}this.fireValueHelpRequest({fromSuggestions:F,_userInputValue:i});};v.prototype._fireValueHelpRequestForValueHelpOnly=function(){if(this.getEnabled()&&this.getEditable()&&this.getShowValueHelp()&&this.getValueHelpOnly()){if(D.system.phone){this.focus();}this._fireValueHelpRequest(false);}};v.prototype.ontap=function(E){I.prototype.ontap.call(this,E);if(this.isValueHelpOnlyOpener(E.target)){this._fireValueHelpRequestForValueHelpOnly();}if(this.isMobileDevice()&&this.getEditable()&&this.getEnabled()&&this.getShowSuggestion()&&this._oSuggPopover&&E.target.id!=this.getId()+"-vhi"){this._openSuggestionsPopover();}};v.prototype.setFilterFunction=function(F){if(F===null||F===undefined){this._fnFilter=m;return this;}j(typeof(F)==="function","Input.setFilterFunction: first argument fnFilter must be a function on "+this);this._fnFilter=F;return this;};v.prototype.setRowResultFunction=function(F){var i;if(F===null||F===undefined){this._fnRowResultFilter=e._DEFAULTRESULT_TABULAR;return this;}j(typeof(F)==="function","Input.setRowResultFunction: first argument fnFilter must be a function on "+this);this._fnRowResultFilter=F;i=this.getSelectedRow();if(i){this.setSelectedRow(i);}return this;};v.prototype.closeSuggestions=function(){this._closeSuggestionPopup();};v.prototype._doSelect=function(i,E){if(D.support.touch){return;}var x=this._$input[0];if(x){var R=this._$input;x.focus();R.selectText(i?i:0,E?E:R.val().length);}return this;};v.prototype._isIncrementalType=function(){var i=this.getType();if(i==="Number"||i==="Date"||i==="Datetime"||i==="Month"||i==="Time"||i==="Week"){return true;}return false;};v.prototype.onsapescape=function(E){var i;if(this._isSuggestionsPopoverOpen()){E.originalEvent._sapui_handledByControl=true;this._oSuggPopover._iPopupListSelectedIndex=-1;this._closeSuggestionPopup();if(this._sBeforeSuggest!==undefined){if(this._sBeforeSuggest!==this.getValue()){i=this.getLastValue();this.setValue(this._sBeforeSuggest);this.setLastValue(i);}this._sBeforeSuggest=undefined;}return;}if(this.getValueLiveUpdate()){this.setProperty("value",this.getLastValue(),true);}if(I.prototype.onsapescape){I.prototype.onsapescape.apply(this,arguments);}};v.prototype.onsapenter=function(E){this.cancelPendingSuggest();if(this._isSuggestionsPopoverOpen()){if(!this._updateSelectionFromList()&&!this.isComposingCharacter()){this._closeSuggestionPopup();}}if(I.prototype.onsapenter){I.prototype.onsapenter.apply(this,arguments);}if(this.getEnabled()&&this.getEditable()&&!(this.getValueHelpOnly()&&this.getShowValueHelp())){this.fireSubmit({value:this.getValue()});}};v.prototype.onsapfocusleave=function(E){var i=this._oSuggPopover,x=i&&i._oPopover,F=E.relatedControlId&&sap.ui.getCore().byId(E.relatedControlId),y=F&&F.getFocusDomRef(),H=i&&i._sProposedItemText&&this.getAutocomplete(),z=x&&y&&h(x.getDomRef(),y);if(x instanceof P){if(z&&!i.bMessageValueStateActive){this._bPopupHasFocus=true;if(D.system.desktop&&k(x.getFocusDomRef(),y)||F.isA("sap.m.GroupHeaderListItem")){this.focus();}}else{if(this.getDOMValue()===this._sSelectedSuggViaKeyboard){this._sSelectedSuggViaKeyboard=null;}}}if(!z&&!H){I.prototype.onsapfocusleave.apply(this,arguments);}this.bValueHelpRequested=false;};v.prototype.onmousedown=function(E){if(this._isSuggestionsPopoverOpen()){E.stopPropagation();}};v.prototype._deregisterEvents=function(){if(this._oSuggPopover){this._oSuggPopover._deregisterResize();}if(this.isMobileDevice()&&this._oSuggPopover&&this._oSuggPopover._oPopover){this.$().off("click");}};v.prototype.updateSuggestionItems=function(){this._bSuspendInvalidate=true;this.updateAggregation("suggestionItems");this._synchronizeSuggestions();this._bSuspendInvalidate=false;return this;};v.prototype.invalidate=function(){if(!this._bSuspendInvalidate){d.prototype.invalidate.apply(this,arguments);}};v.prototype.cancelPendingSuggest=function(){if(this._iSuggestDelay){clearTimeout(this._iSuggestDelay);this._iSuggestDelay=null;}};v.prototype._triggerSuggest=function(V){this.cancelPendingSuggest();this._bShouldRefreshListItems=true;if(!V){V="";}if(V.length>=this.getStartSuggestion()){this._iSuggestDelay=setTimeout(function(){if(this._sPrevSuggValue!==V){this._bBindingUpdated=false;this.fireSuggest({suggestValue:V});if(!this._bBindingUpdated){this._refreshItemsDelayed();}this._sPrevSuggValue=V;}}.bind(this),300);}else if(this.isMobileDevice()){if(this._oSuggPopover._oList instanceof T){this._oSuggPopover._oList.addStyleClass("sapMInputSuggestionTableHidden");}else if(this._oSuggPopover._oList&&this._oSuggPopover._oList.destroyItems){this._oSuggPopover._oList.destroyItems();}}else if(this._isSuggestionsPopoverOpen()){setTimeout(function(){var N=this.getDOMValue()||'';if(N<this.getStartSuggestion()){this._oSuggPopover._iPopupListSelectedIndex=-1;this._closeSuggestionPopup();}}.bind(this),0);}};(function(){v.prototype.setShowSuggestion=function(V){this.setProperty("showSuggestion",V,true);if(V){this._oSuggPopover=this._getSuggestionsPopover();this._oSuggPopover._iPopupListSelectedIndex=-1;if(!this._oSuggPopover._oPopover){this._createSuggestionsPopoverPopup();this._synchronizeSuggestions();this._createSuggestionPopupContent();}}else{if(this._oSuggPopover){this._oSuggPopover._destroySuggestionPopup();this._oSuggPopover._iPopupListSelectedIndex=-1;this._oButtonToolbar=null;this._oShowMoreButton=null;}}return this;};v.prototype._shouldTriggerSuggest=function(){return!this._bPopupHasFocus&&!this.getStartSuggestion()&&!this.getValue()&&this.getShowSuggestion();};v.prototype.setShowTableSuggestionValueHelp=function(V){this.setProperty("showTableSuggestionValueHelp",V,true);if(!(this._oSuggPopover&&this._oSuggPopover._oPopover)){return this;}if(V){this._addShowMoreButton();}else{this._removeShowMoreButton();}return this;};v.prototype.onchange=function(E){if(this.getShowValueHelp()||this.getShowSuggestion()){return;}this.onChange(E);};v.prototype.oninput=function(E){I.prototype.oninput.call(this,E);if(E.isMarked("invalid")){return;}var V=this.getDOMValue(),i,x,y;if(this.getValueLiveUpdate()){this.setProperty("value",V,true);this._onValueUpdated(V);}this.fireLiveChange({value:V,newValue:V});this.addStyleClass("sapMFocus");if(this.getShowSuggestion()&&!this.isMobileDevice()){i=this._getSuggestionsPopover();x=i._oList;this._triggerSuggest(V);if(x&&!i.bMessageValueStateActive){y=x.getSelectedItem();x.removeStyleClass("sapMListFocus");y&&y.removeStyleClass("sapMLIBFocused");}else if(i.bMessageValueStateActive&&document.activeElement.tagName!=="A"){i._getValueStateHeader().removeStyleClass("sapMPseudoFocus");}}};v.prototype.getValue=function(){return this.getDomRef("inner")&&this._$input?this.getDOMValue():this.getProperty("value");};v.prototype._refreshItemsDelayed=function(){clearTimeout(this._iRefreshListTimeout);this._iRefreshListTimeout=setTimeout(function(){if(this._oSuggPopover){this._refreshListItems();}}.bind(this),0);};v.prototype._filterListItems=function(x,y){var i,z,A,E=[],H=[],F=this.getFilterSuggests(),J=false;for(i=0;i<x.length;i++){A=x[i];if(x[i].isA("sap.ui.core.SeparatorItem")){z=new G({id:A.getId()+"-ghli",title:M.escapeSettingsValue(x[i].getText())});E.push({header:z,visible:false});this._configureListItem(A,z);H.push(z);}else if(!F||this._fnFilter(y,A)){z=new S({title:M.escapeSettingsValue(A.getText()),info:M.escapeSettingsValue(A.getAdditionalText&&A.getAdditionalText())});if(!J&&(this._oSuggPopover._sProposedItemText===x[i].getText())){z.setSelected(true);J=true;}if(E.length){E[E.length-1].visible=true;}this._configureListItem(A,z);H.push(z);}}E.forEach(function(K){K.header.setVisible(K.visible);});return{hitItems:H,groups:E};};v.prototype._filterTabularItems=function(x,y){var i,z,F=this.getFilterSuggests(),H=[],A=[],E=false;for(i=0;i<x.length;i++){if(x[i].isA("sap.m.GroupHeaderListItem")){A.push({header:x[i],visible:false});}else{z=!F||this._fnFilter(y,x[i]);x[i].setVisible(z);z&&H.push(x[i]);if(!E&&z&&this._oSuggPopover._sProposedItemText===this._fnRowResultFilter(x[i])){x[i].setSelected(true);E=true;}if(A.length&&z){A[A.length-1].visible=true;}}}A.forEach(function(J){J.header.setVisible(J.visible);});this._getSuggestionsTable().invalidate();return{hitItems:H,groups:A};};v.prototype._clearSuggestionPopupItems=function(){if(!this._oSuggPopover._oList){return;}if(this._oSuggPopover._oList instanceof T){this._oSuggPopover._oList.removeSelections(true);}else{this._oSuggPopover._oList.destroyItems();}};v.prototype._hideSuggestionPopup=function(){var i=this._oSuggPopover._oPopover;function x(){if(D.browser.internet_explorer){var F=this.getFocusInfo();this.setDOMValue(this._oSuggPopover._sTypedInValue);this.applyFocusInfo(F);}else{this.setDOMValue(this._oSuggPopover._sTypedInValue);}}if(!this.isMobileDevice()){if(this._isSuggestionsPopoverOpen()){this._sCloseTimer=setTimeout(function(){if(this._oSuggPopover){this._oSuggPopover._iPopupListSelectedIndex=-1;}this.cancelPendingSuggest();if(this._oSuggPopover._sTypedInValue){x.call(this);}this._oSuggPopover._oProposedItem=null;i.close();}.bind(this),0);}}else if(this._hasTabularSuggestions()&&this._oSuggPopover._oList){this._oSuggPopover._oList.addStyleClass("sapMInputSuggestionTableHidden");}this.$("SuggDescr").text("");this.$("inner").removeAttr("aria-activedescendant");};v.prototype._openSuggestionPopup=function(O){if(!this.isMobileDevice()){if(this._sCloseTimer){clearTimeout(this._sCloseTimer);this._sCloseTimer=null;}if(!this._isSuggestionsPopoverOpen()&&!this._sOpenTimer&&O!==false){this._sOpenTimer=setTimeout(function(){this._sOpenTimer=null;this._oSuggPopover&&this._openSuggestionsPopover();}.bind(this),0);}}};v.prototype._getFilteredSuggestionItems=function(i){var F,x=this.getSuggestionItems(),y=this.getSuggestionRows();if(this._hasTabularSuggestions()){if(this.isMobileDevice()&&this._oSuggPopover._oList){this._oSuggPopover._oList.removeStyleClass("sapMInputSuggestionTableHidden");}F=this._filterTabularItems(y,i);}else{F=this._filterListItems(x,i);}return F;};v.prototype._fillSimpleSuggestionPopupItems=function(F){var i,H=F.hitItems,x=F.groups,y=H.length,z=y;if(!this._hasTabularSuggestions()){for(i=0;i<y;i++){this._oSuggPopover._oList.addItem(H[i]);}z-=x.length;}return z;};v.prototype._applySuggestionAcc=function(N){var A="",R=this._oRb;if(N===1){A=R.getText("INPUT_SUGGESTIONS_ONE_HIT");}else if(N>1){A=R.getText("INPUT_SUGGESTIONS_MORE_HITS",N);}else{A=R.getText("INPUT_SUGGESTIONS_NO_HIT");}this.$("SuggDescr").text(A);};v.prototype._refreshListItems=function(){var i=this.getShowSuggestion(),x=this._oSuggPopover._bDoTypeAhead?this._oSuggPopover._sTypedInValue:(this.getDOMValue()||""),F,y;this._oSuggPopover._iPopupListSelectedIndex=-1;if(!i||!this._bShouldRefreshListItems||!this.getDomRef()||(!this.isMobileDevice()&&!this.$().hasClass("sapMInputFocused"))){return null;}this._clearSuggestionPopupItems();if(x.length<this.getStartSuggestion()){this._hideSuggestionPopup();return false;}F=this._getFilteredSuggestionItems(x);y=this._fillSimpleSuggestionPopupItems(F);if(y>0){this._openSuggestionPopup(this.getValue().length>=this.getStartSuggestion());}else{this._hideSuggestionPopup();}this._applySuggestionAcc(y);};v.prototype._configureListItem=function(i,x){var y=p.Active;if(!i.getEnabled()||x.isA("sap.m.GroupHeaderListItem")){y=p.Inactive;}x.setType(y);x._oItem=i;x.addEventDelegate({ontouchstart:function(E){(E.originalEvent||E)._sapui_cancelAutoClose=true;}});return x;};v.prototype.addSuggestionItem=function(i){this.addAggregation("suggestionItems",i,true);if(!this._oSuggPopover){this._getSuggestionsPopover();}this._synchronizeSuggestions();this._createSuggestionPopupContent();return this;};v.prototype.insertSuggestionItem=function(i,x){this.insertAggregation("suggestionItems",x,i,true);if(!this._oSuggPopover){this._getSuggestionsPopover();}this._synchronizeSuggestions();this._createSuggestionPopupContent();return this;};v.prototype.removeSuggestionItem=function(i){var x=this.removeAggregation("suggestionItems",i,true);this._synchronizeSuggestions();return x;};v.prototype.removeAllSuggestionItems=function(){var i=this.removeAllAggregation("suggestionItems",true);this._synchronizeSuggestions();return i;};v.prototype.destroySuggestionItems=function(){this.destroyAggregation("suggestionItems",true);this._synchronizeSuggestions();return this;};v.prototype.addSuggestionRow=function(i){i.setType(p.Active);this.addAggregation("suggestionRows",i);this._synchronizeSuggestions();this._createSuggestionPopupContent(true);return this;};v.prototype.insertSuggestionRow=function(i,x){i.setType(p.Active);this.insertAggregation("suggestionRows",i,x);this._synchronizeSuggestions();this._createSuggestionPopupContent(true);return this;};v.prototype.removeSuggestionRow=function(i){var x=this.removeAggregation("suggestionRows",i);this._synchronizeSuggestions();return x;};v.prototype.removeAllSuggestionRows=function(){var i=this.removeAllAggregation("suggestionRows");this._synchronizeSuggestions();return i;};v.prototype.destroySuggestionRows=function(){this.destroyAggregation("suggestionRows");this._synchronizeSuggestions();return this;};v.prototype.bindAggregation=function(){if(arguments[0]==="suggestionRows"||arguments[0]==="suggestionColumns"||arguments[0]==="suggestionItems"){this._createSuggestionPopupContent(arguments[0]==="suggestionRows"||arguments[0]==="suggestionColumns");this._bBindingUpdated=true;}return I.prototype.bindAggregation.apply(this,arguments);};v.prototype._closeSuggestionPopup=function(){if(this._isSuggestionsPopoverOpen()){this.cancelPendingSuggest();this._oSuggPopover._oPopover.close();if(!this.isMobileDevice()&&this.$().hasClass("sapMInputFocused")){this.openValueStateMessage();}this.$("SuggDescr").text("");this.$("inner").removeAttr("aria-activedescendant");this._sPrevSuggValue=null;}};v.prototype._synchronizeSuggestions=function(){if(document.activeElement===this.getFocusDomRef()){this._bShouldRefreshListItems=true;this._refreshItemsDelayed();}if(!this.getDomRef()||this._isSuggestionsPopoverOpen()){return;}this._synchronizeSelection();};v.prototype._synchronizeSelection=function(){var i=this.getSelectedKey();if(!i){return;}if(this.getValue()&&!this.getSelectedItem()&&!this.getSelectedRow()){return;}this.setSelectedKey(i);};})();v.prototype.onfocusin=function(E){I.prototype.onfocusin.apply(this,arguments);this.addStyleClass("sapMInputFocused");if(!this.isMobileDevice()&&this._isSuggestionsPopoverOpen()){this.closeValueStateMessage();}if(this._shouldTriggerSuggest()){this._triggerSuggest(this.getValue());}this._bPopupHasFocus=undefined;this._sPrevSuggValue=null;};v.prototype.oncompositionend=function(E){I.prototype.oncompositionend.apply(this,arguments);if(this._oSuggPopover&&!D.browser.edge&&!D.browser.firefox){this._oSuggPopover._handleTypeAhead();}};v.prototype.onsapshow=function(E){if(!this.getEnabled()||!this.getEditable()||!this.getShowValueHelp()){return;}this.bValueHelpRequested=true;this._fireValueHelpRequest(false);E.preventDefault();E.stopPropagation();};v.prototype.onsaphide=v.prototype.onsapshow;v.prototype.onsapselect=function(E){this._fireValueHelpRequestForValueHelpOnly();};v.prototype.onfocusout=function(E){I.prototype.onfocusout.apply(this,arguments);this.removeStyleClass("sapMInputFocused");this.$("SuggDescr").text("");};v.prototype._hasTabularSuggestions=function(){return!!(this.getAggregation("suggestionColumns")&&this.getAggregation("suggestionColumns").length);};v.prototype._getSuggestionsTable=function(){if(this._bIsBeingDestroyed){return this._oSuggestionTable;}if(!this._oSuggestionTable){this._oSuggestionTable=new T(this.getId()+"-popup-table",{mode:t.SingleSelectMaster,showNoData:false,showSeparators:u.None,width:"100%",enableBusyIndicator:false,rememberSelections:false,itemPress:function(E){if(D.system.desktop){this.focus();}this._oSuggPopover._bSuggestionItemTapped=true;var i=E.getParameter("listItem");this.setSelectionRow(i,true);}.bind(this),sticky:[l.Sticky.ColumnHeaders]});this._oSuggestionTable.addEventDelegate({onAfterRendering:function(){var i,x;if(!this.getEnableSuggestionsHighlighting()){return;}i=this._oSuggestionTable.$().find('tbody .sapMLabel');x=(this._sTypedInValue||this.getValue()).toLowerCase();n(i,x);}.bind(this)});if(this.isMobileDevice()){this._oSuggestionTable.addStyleClass("sapMInputSuggestionTableHidden");}this._oSuggestionTable.updateItems=function(){T.prototype.updateItems.apply(this,arguments);this._refreshItemsDelayed();return this;};}return this._oSuggestionTable;};v.prototype.clone=function(){var i=d.prototype.clone.apply(this,arguments);i.setRowResultFunction(this._fnRowResultFilter);i.setValue(this.getValue());return i;};v.prototype.setValue=function(V){this._iSetCount++;I.prototype.setValue.call(this,V);this._onValueUpdated(V);return this;};v.prototype.setDOMValue=function(i){this._$input.val(i);};v.prototype.getDOMValue=function(){return this._$input.val();};v.prototype.updateInputField=function(N){if(this._isSuggestionsPopoverOpen()&&this.isMobileDevice()){this._oSuggPopover._oPopupInput.setValue(N);this._oSuggPopover._oPopupInput._doSelect();}else{N=this._getInputValue(N);this.setDOMValue(N);this.onChange(null,null,N);}};v.prototype.getAccessibilityInfo=function(){var i=I.prototype.getAccessibilityInfo.apply(this,arguments);i.description=((i.description||"")+" "+this.getDescription()).trim();return i;};v.prototype.preventChangeOnFocusLeave=function(E){return this.bFocusoutDueRendering||this.bValueHelpRequested;};v.prototype._getShowMoreButton=function(){return this._oShowMoreButton||(this._oShowMoreButton=new B({text:this._oRb.getText("INPUT_SUGGESTIONS_SHOW_ALL"),press:this._getShowMoreButtonPress.bind(this)}));};v.prototype._getShowMoreButtonPress=function(){var i;if(this.getShowTableSuggestionValueHelp()){if(this._oSuggPopover._sTypedInValue){i=this._oSuggPopover._sTypedInValue;this.updateDomValue(i);this._oSuggPopover._resetTypeAhead();this._oSuggPopover._sTypedInValue=i;}this._fireValueHelpRequest(true);this._oSuggPopover._iPopupListSelectedIndex=-1;this._closeSuggestionPopup();}};v.prototype._addShowMoreButton=function(i){var x=this._oSuggPopover&&this._oSuggPopover._oPopover;if(!x||!i&&!this._hasTabularSuggestions()){return;}if(x.isA("sap.m.Dialog")){var y=this._getShowMoreButton();x.setEndButton(y);}else{var z=this._getButtonToolbar();x.setFooter(z);}};v.prototype._removeShowMoreButton=function(){var i=this._oSuggPopover&&this._oSuggPopover._oPopover;if(!i||!this._hasTabularSuggestions()){return;}if(i.isA("sap.m.Dialog")){i.setEndButton(null);}else{i.setFooter(null);}};v.prototype._getButtonToolbar=function(){var i=this._getShowMoreButton();return this._oButtonToolbar||(this._oButtonToolbar=new f({content:[new g(),i]}));};v.prototype._hasShowSelectedButton=function(){return false;};v.prototype._createSuggestionPopupContent=function(i){if(this._bIsBeingDestroyed||this._getSuggestionsPopover()._oList){return;}this._oSuggPopover._createSuggestionPopupContent(i);if(!this._hasTabularSuggestions()&&!i){this._oSuggPopover._oList.attachItemPress(function(E){if(D.system.desktop){this.focus();}var x=E.getParameter("listItem");if(!x.isA("sap.m.GroupHeaderListItem")){this._oSuggPopover._bSuggestionItemTapped=true;this.setSelectionItem(x._oItem,true);}},this);}else{if(this._fnFilter===m){this._fnFilter=v._DEFAULTFILTER_TABULAR;}if(!this._fnRowResultFilter){this._fnRowResultFilter=v._DEFAULTRESULT_TABULAR;}if(this.getShowTableSuggestionValueHelp()){this._addShowMoreButton(i);}}};v.prototype._createPopupInput=function(){var i=new v(this.getId()+"-popup-input",{width:"100%",valueLiveUpdate:true,showValueStateMessage:false,valueState:this.getValueState(),showValueHelp:this.getShowValueHelp(),valueHelpRequest:function(E){this.fireValueHelpRequest({fromSuggestions:true});this._oSuggPopover._iPopupListSelectedIndex=-1;this._closeSuggestionPopup();}.bind(this),liveChange:function(E){var V=E.getParameter("newValue");this.setDOMValue(this._getInputValue(this._oSuggPopover._oPopupInput.getValue()));this._triggerSuggest(V);this.fireLiveChange({value:V,newValue:V});}.bind(this)});return i;};v.prototype._modifyPopupInput=function(i){i.addEventDelegate({onsapenter:function(){if(this.getAutocomplete()){this._oSuggPopover._finalizeAutocomplete();}this._closeSuggestionPopup();}},this);return i;};v.prototype.forwardEventHandlersToSuggPopover=function(i){i.setOkPressHandler(this._closeSuggestionPopup.bind(this));i.setCancelPressHandler(this._closeSuggestionPopup.bind(this));};v.prototype._getSuggestionsPopover=function(){if(!this._oSuggPopover){var i=this._oSuggPopover=new e(this);if(this.isMobileDevice()){var x=this._createPopupInput();i._oPopupInput=this._modifyPopupInput(x);}this._oSuggPopover.setInputLabels(this.getLabels.bind(this));this._createSuggestionsPopoverPopup();this.forwardEventHandlersToSuggPopover(i);i._bAutocompleteEnabled=this.getAutocomplete();i.attachEvent(e.M_EVENTS.SELECTION_CHANGE,function(E){var N=E.getParameter("newValue");this.setDOMValue(N);this._sSelectedSuggViaKeyboard=N;this._doSelect();},this);if(this.getShowTableSuggestionValueHelp()){this._addShowMoreButton();}}return this._oSuggPopover;};v.prototype._createSuggestionsPopoverPopup=function(){if(!this._oSuggPopover){return;}var i=this._oSuggPopover;var x;i._createSuggestionPopup({showSelectedButton:this._hasShowSelectedButton()});x=i._oPopover;x.attachBeforeOpen(function(){this._updateSuggestionsPopoverValueState();},this);x.attachBeforeClose(function(){this._updateSuggestionsPopoverValueState();},this);if(this.isMobileDevice()){x.attachBeforeClose(function(){this.setDOMValue(this._getInputValue(i._oPopupInput.getValue()));this.onChange();},this).attachAfterClose(function(){var y=i._oList;if(!y){return;}if(T&&!(y instanceof T)){y.destroyItems();}else{y.removeSelections(true);}}).attachAfterOpen(function(){this._triggerSuggest(this.getValue());this._refreshListItems();},this).attachBeforeOpen(function(){i._oPopupInput.setPlaceholder(this.getPlaceholder());i._oPopupInput.setMaxLength(this.getMaxLength());i._oPopupInput.setValue(this.getValue());},this);}else{x.attachAfterClose(function(){this._updateSelectionFromList();var y=i._oList,z=y.getSelectedItem();if(!y){return;}if(y instanceof T){z&&z.removeStyleClass("sapMLIBFocused");y.removeSelections(true);}else{y.destroyItems();}i._deregisterResize();},this).attachBeforeOpen(function(){i._sPopoverContentWidth=this.getMaxSuggestionWidth();i._bEnableHighlighting=this.getEnableSuggestionsHighlighting();i._bAutocompleteEnabled=this.getAutocomplete();i._bIsInputIncrementalType=this._isIncrementalType();this._sBeforeSuggest=this.getValue();i._resizePopup();i._registerResize();},this);}this.setAggregation("_suggestionPopup",x);this._oSuggestionPopup=x;};v.prototype.showItems=function(F){var i,x,y=this._fnFilter;if(!this.getEnabled()||!this.getEditable()){return;}this.setFilterFunction(F||function(){return true;});this._clearSuggestionPopupItems();i=this._getFilteredSuggestionItems(this.getDOMValue());x=this._fillSimpleSuggestionPopupItems(i);if(x>0){this._openSuggestionPopup();}else{this._hideSuggestionPopup();}this._applySuggestionAcc(x);this.setFilterFunction(y);};v.prototype.shouldValueStateMessageBeOpened=function(){var i=I.prototype.shouldValueStateMessageBeOpened.apply(this,arguments);if(!i||this._isSuggestionsPopoverOpen()){return false;}return true;};v.prototype._isSuggestionsPopoverOpen=function(){return this._oSuggPopover&&this._oSuggPopover.isOpen();};v.prototype.isMobileDevice=function(){return D.system.phone;};v.prototype._openSuggestionsPopover=function(){this.closeValueStateMessage();this._updateSuggestionsPopoverValueState();this._oSuggPopover._oPopover.open();};v.prototype._updateSuggestionsPopoverValueState=function(){var i=this._oSuggPopover,V=this.getValueState(),N=this.getValueState()!==i._getValueStateHeader().getValueState(),x=this.getFormattedValueStateText(),y=this.getValueStateText();if(!i){return;}if(this._isSuggestionsPopoverOpen()&&!x&&!N){this.setFormattedValueStateText(this._oSuggPopover._getValueStateHeader().getFormattedText());}i.updateValueState(V,(x||y),this.getShowValueStateMessage());if(this.isMobileDevice()){i._oPopupInput.setValueState(V);}};v.prototype.setShowValueHelp=function(i){this.setProperty("showValueHelp",i);if(this._oSuggPopover&&this._oSuggPopover._oPopupInput){this._oSuggPopover._oPopupInput.setShowValueHelp(i);}return this;};v.prototype.isValueHelpOnlyOpener=function(i){return true;};return v;});
