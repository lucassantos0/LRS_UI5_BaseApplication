/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["ui5loader","sap/ui/core/Control","sap/ui/core/Core","sap/base/util/deepClone","sap/base/util/merge","sap/ui/integration/widgets/Card","sap/ui/integration/Designtime","sap/ui/model/json/JSONModel","sap/ui/integration/util/CardMerger","sap/m/Label","sap/m/Title","sap/ui/core/Icon","sap/m/ResponsivePopover","sap/m/Popover","sap/m/Text","sap/base/Log","sap/ui/core/Popup","sap/base/i18n/ResourceBundle","sap/ui/thirdparty/URI","sap/ui/dom/includeStylesheet","sap/base/util/LoaderExtensions","sap/ui/core/theming/Parameters","sap/base/util/ObjectPath"],function(u,C,b,d,m,c,D,J,e,L,T,I,R,P,f,g,h,k,U,l,p,q,O){"use strict";var r=P.prototype.init;P.prototype.init=function(){r.apply(this,arguments);var a=this.oPopup._applyPosition,i=this;this.oPopup._applyPosition=function(){var j=i.close;i.close=function(){};a.apply(this,arguments);i.close=j;};};function t(s){if(s&&s.nodeType!==1){return 0;}var z=parseInt(window.getComputedStyle(s).getPropertyValue('z-index'));if(isNaN(z)){return t(s.parentNode);}return z+1;}var v=/\{\{(?!parameters.)(?!destinations.)([^\}\}]+)\}\}/g,w=5000,x=b.getLibraryResourceBundle("sap.ui.integration");var y=C.extend("sap.ui.integration.designtime.editor.CardEditor",{metadata:{library:"sap.ui.integration",properties:{card:{type:"any",defaultValue:null},mode:{type:"string",defaultValue:"admin"},language:{type:"string",defaultValue:""},allowDynamicValues:{type:"boolean",defaultValue:false},allowSettings:{type:"boolean",defaultValue:false},designtime:{type:"object"}},aggregations:{_formContent:{type:"sap.ui.core.Control",multiple:true,visibility:"hidden"},_preview:{type:"sap.ui.integration.designtime.editor.CardPreview",multiple:false,visibility:"hidden"}},events:{ready:{}}},renderer:function(o,a){o.openStart("div");a.getMode()==="translation"?o.addClass("sapUiIntegrationCardEditorTranslation"):o.addClass("sapUiIntegrationCardEditorPreview");o.addClass("sapUiIntegrationCardEditor");o.writeClasses();o.writeElementData(a);o.openEnd();if(a.isReady()){o.openStart("div");o.addClass("sapUiIntegrationCardEditorForm");if(a.getMode()!=="translation"){o.addClass("settingsButtonSpace");}o.writeClasses();o.openEnd();var j=a.getAggregation("_formContent");if(j){var n,s=0;for(var i=0;i<j.length;i++){var z=j[i];if(z.isA("sap.m.Label")){n=z;continue;}o.openStart("div");o.addClass("sapUiIntegrationCardEditorItem");if(a.getMode()==="translation"){o.addClass("language");}if(z._cols===1){o.addClass("sapUiIntegrationCardEditorItemCol"+(++s));}else{s=0;}o.writeClasses();o.openEnd();if(z.isA("sap.m.Title")){o.renderControl(z);}else{if(n){var B=n.getDependents()&&n.getDependents()[0];o.openStart("div");o.addClass("sapUiIntegrationCardEditorItemLabel");if(B&&a.getMode()!=="translation"){o.addClass("description");}o.openEnd();o.renderControl(n);if(B){o.renderControl(B);}o.close("div");}o.renderControl(z);}o.close("div");n=null;s=s==2?0:s;}}o.close("div");var E=a.getAggregation("_preview");E&&o.renderControl(E);}o.close("div");}});y.prototype.init=function(){this._ready=false;this._aFieldReadyPromise=[];this._oResourceBundle=x;this._appliedLayerManifestChanges=[];this._currentLayerManifestChanges={};this._mDestinationDataProviders={};};y.prototype.isReady=function(){return this._ready;};function A(o,s,a,i){i=i||"";a=a||[];if(typeof o==="object"){if(!o[s]){for(var n in o){A(o[n],s,a,i+"/"+n);}}else{if(o.type){a.push({path:o.pathvalue||i.substring(1),value:o.pathvalue||"{context>"+i.substring(1)+"/value}",object:o});}else{a.push({path:i.substring(1),object:o});for(var n in o){A(o[n],s,a,i+"/"+n);}}}}return a;}y.prototype._filterManifestChangesByLayer=function(M){var a=[],o={":layer":e.layers[this.getMode()]},i=e.layers[this.getMode()];M.manifestChanges.forEach(function(j){var n=j.hasOwnProperty(":layer")?j[":layer"]:1000;if(n<i){a.push(j);}else if(n===i){o=j;}});M.manifestChanges=a;this._currentLayerManifestChanges=o;};y.prototype.setCard=function(a,s){this._ready=false;if(a===this.getProperty("card")){return this;}if(this._oEditorCard){this._oEditorCard.destroy();}if(this._oDesigntimeInstance){this._oDesigntimeInstance.destroy();}this.setProperty("card",a,s);Promise.resolve().then(function(){this._initCard(a);}.bind(this));return this;};y.prototype.setLanguage=function(V,s){if(!V||typeof V!=="string"){return this;}this._language=V.replace("-","_");this.setProperty("language",V,s);if(!y._languages[this._language]){this._language=this._language.split("_")[0];}if(!y._languages[this._language]){g.warning("The language: "+V+" is currently unknown, some UI controls might show "+V+" instead of the language name.");}return this;};y.prototype.onAfterRendering=function(){if(this.getDomRef()){this._iZIndex=t(this.getDomRef());h.setInitialZIndex(this._iZIndex);}};y.prototype._getOriginalManifestJson=function(){try{return this._oEditorCard._oCardManifest._oManifest.getRawJson();}catch(a){return{};}};y.prototype._initCard=function(a){if(typeof a==="string"){try{a=JSON.parse(a);}catch(i){var j=b.byId(a);if(!j){var n=document.getElementById(a);if(n&&n.tagName&&n.tagName==="ui-integration-card"){j=n._getControl();}}a=j;}}if(a&&a.isA&&a.isA("sap.ui.integration.widgets.Card")){a={manifest:a.getManifest(),manifestChanges:a.getManifestChanges(),host:a.getHost(),baseUrl:a.getBaseUrl()};}if(typeof a==="object"){var o=e.layers[this.getMode()];if(a.manifestChanges){this._filterManifestChangesByLayer(a);}this._oEditorCard=new c(a);var s=this;this._oEditorCard._prepareToApplyManifestSettings=function(){c.prototype._prepareToApplyManifestSettings.apply(this,arguments);if(!s._oEditorCard._isManifestReady){return;}if(s._manifestModel){return;}s._appliedLayerManifestChanges=a.manifestChanges;var M=s._oEditorCard.getManifestEntry("/");var _=m({},M);s._oProviderCard=s._oEditorCard;s._oProviderCard._editorManifest=M;s._beforeManifestModel=new J(_);if(o<e.layers["translation"]&&s._currentLayerManifestChanges){M=e.mergeCardDelta(M,[s._currentLayerManifestChanges]);}s._manifestModel=new J(M);s._originalManifestModel=new J(s._getOriginalManifestJson());s._initInternal();if(!s._oEditorCard.getModel("i18n")){s._oEditorCard._loadDefaultTranslations();}s.setModel(s._oEditorCard.getModel("i18n"),"i18n");s._createContextModel();};this._oEditorCard.onBeforeRendering();}};y.prototype._initInternal=function(){var s=this._oEditorCard.getManifestEntry("/sap.card/designtime"),o=this._manifestModel.getProperty("/sap.card/configuration"),a,i=this.getDesigntime();if(i){if(typeof i==="function"){a=new Promise(function(j,n){var z=new i();this._applyDesigntimeDefaults(z.getSettings());j(z);}.bind(this));}else if(typeof i==="object"){a=new Promise(function(j,n){sap.ui.require(["sap/ui/integration/Designtime"],function(D){var z=D.extend("test.Designtime");z.prototype.create=function(){return i;};var B=new z();this._applyDesigntimeDefaults(B.getSettings());j(B);}.bind(this));}.bind(this));}}else if(s){a=this._oEditorCard.loadDesigntime().then(function(j){this._applyDesigntimeDefaults(j.getSettings());return j;}.bind(this));}else{a=Promise.resolve(this._createParameterDesigntime(o));}a.then(function(j){this._oDesigntimeInstance=j;if(this.getMode()==="admin"||this.getMode()==="all"){this._addDestinationSettings(o,this._oDesigntimeInstance);}this._settingsModel=new J(this._oDesigntimeInstance.getSettings());this.setModel(this._settingsModel,"currentSettings");this.setModel(this._settingsModel,"items");this._applyDesigntimeLayers();this._requireFields().then(function(){this._startEditor();}.bind(this));}.bind(this));};y.prototype.getCurrentSettings=function(){var s=this._settingsModel.getProperty("/"),a={},N;if(s&&s.form&&s.form.items){for(var n in s.form.items){var i=s.form.items[n];if(i.editable&&i.visible){if(this.getMode()!=="translation"){if(i.translatable&&!i._changed&&i._translatedDefaultPlaceholder&&!this._currentLayerManifestChanges[i.manifestPath]){continue;}else{a[i.manifestpath]=i.value;}}else if(i.translatable&&i.value){a[i.manifestpath]=i.value;}if(i._next&&(this.getAllowSettings())){if(i._next.editable===false){N=N||{};N[i._settingspath+"/editable"]=false;}if(i._next.visible===false){N=N||{};N[i._settingspath+"/visible"]=false;}if(typeof i._next.allowDynamicValues==="boolean"&&this.getAllowDynamicValues()){N=N||{};N[i._settingspath+"/allowDynamicValues"]=i._next.allowDynamicValues;}}}}}a[":layer"]=e.layers[this.getMode()];a[":errors"]=this.checkCurrentSettings()[":errors"];if(N){a[":designtime"]=N;}return a;};y.prototype.checkCurrentSettings=function(){var s=this._settingsModel.getProperty("/"),a={};if(s&&s.form&&s.form.items){for(var n in s.form.items){var i=s.form.items[n];if(i.editable){if((i.isValid||i.required)&&!(this.getMode()==="translation"&&i.translatable)){if(i.isValid){a[i.manifestpath]=i.isValid(i);}a[i.manifestpath]=true;var j=i.value;var o=i.type;if(o==="string"&&j===""){a[i.manifestpath]=j;}if((o==="date"||o==="datetime")&&isNaN(Date.parse(j))){a[i.manifestpath]=j;}if(o==="integer"){if(isNaN(parseInt(j))){a[i.manifestpath]=j;}else if(j<i.min||j>i.max){a[i.manifestpath]=j;}}if(o==="number"){if(isNaN(parseFloat(j))){a[i.manifestpath]=j;}else if(j<i.min||j>i.max){a[i.manifestpath]=j;}}}}}a[":layer"]=e.layers[this.getMode()];}a[":errors"]=Object.values(a).indexOf(false)>-1;return a;};y.prototype._createContextModel=function(){var H=this._oEditorCard.getHostInstance(),i=new J({}),F=new J([]);this.setModel(i,"context");this.setModel(F,"contextflat");F._getPathObject=function(s){var a=this.getData().filter(function(o){if(o.path===s){return true;}});return a.length?a[0]:null;};F._getValueObject=function(V){var a=this.getData()||[];a=a.filter(function(o){if(o.value===V||o.object.value===V){return true;}});return a.length?a[0]:null;};var j=new Promise(function(a,n){if(H&&H.getContext){var o=false;setTimeout(function(){if(o){return;}g.error("Card Editor context could not be determined with "+w+".");o=true;a({});},w);H.getContext().then(function(s){if(o){g.error("Card Editor context returned after more than "+w+". Context is ignored.");}o=true;a(s||{});});}else{a({});}});j.then(function(o){var a={};a["empty"]=y._contextEntries.empty;for(var n in o){a[n]=o[n];}a["card.internal"]=y._contextEntries["card.internal"];i.setData(a);F.setData(A(a,"label"));});i.getProperty=function(s,o){var a=this.resolve(s,o);if(a.endsWith("/value")){this._mValues=this._mValues||{};if(this._mValues.hasOwnProperty(a)){return this._mValues[a];}this._mValues[a]=undefined;H.getContextValue(a.substring(1)).then(function(V){this._mValues[a]=V;this.checkUpdate();}.bind(this));return undefined;}else{return J.prototype.getProperty.apply(this,arguments);}};};y.fieldMap={"string":"sap/ui/integration/designtime/editor/fields/StringField","integer":"sap/ui/integration/designtime/editor/fields/IntegerField","number":"sap/ui/integration/designtime/editor/fields/NumberField","boolean":"sap/ui/integration/designtime/editor/fields/BooleanField","date":"sap/ui/integration/designtime/editor/fields/DateField","datetime":"sap/ui/integration/designtime/editor/fields/DateTimeField","string[]":"sap/ui/integration/designtime/editor/fields/ListField","destination":"sap/ui/integration/designtime/editor/fields/DestinationField"};y.Fields=null;y.prototype._requireFields=function(){if(y.Fields){return Promise.resolve();}return new Promise(function(a){sap.ui.require(Object.values(y.fieldMap),function(){y.Fields={};for(var n in y.fieldMap){y.Fields[n]=arguments[Object.keys(y.fieldMap).indexOf(n)];}a();});});};y.prototype._createLabel=function(o){var a=new L({text:o.label,required:o.required&&o.editable||false,visible:o.visible,objectBindings:{currentSettings:{path:"currentSettings>"+o._settingspath},items:{path:"items>/form/items"}}});a._cols=o.cols||2;if(o.description){var i=new I({src:"sap-icon://message-information",color:"Marker",size:"12px",useIconTooltip:false,visible:this.getMode()!=="translation"});i.addStyleClass("sapUiIntegrationCardEditorDescriptionIcon");a.addDependent(i);i.onmouseover=function(){this._getPopover().getContent()[0].applySettings({text:o.description});this._getPopover().openBy(i);i.addDependent(this._getPopover());}.bind(this);i.onmouseout=function(){this._getPopover().close();i.removeDependent(this._getPopover());}.bind(this);}return a;};y.prototype._getPopover=function(){if(this._oPopover){return this._oPopover;}var o=new f({text:""});o.addStyleClass("sapUiTinyMargin sapUiIntegrationCardEditorDescriptionText");this._oPopover=new R({showHeader:false,content:[o]});this._oPopover.addStyleClass("sapUiIntegrationCardEditorPopover");return this._oPopover;};y.prototype._updateProviderCard=function(a){if(this._ready){var M=this._oProviderCard._editorManifest;if(a.length===0){return;}for(var i=0;i<a.length;i++){var o=a[i];o.config._cancel=true;}delete M["sap.card"].header;delete M["sap.card"].content;delete M["sap.card"].data;M["sap.card"].type="List";var j=this._oProviderCard;this._oProviderCard=new c({manifest:M,baseUrl:this._getBaseUrl(),host:this._oProviderCard.getHost()});this._oProviderCard.setManifestChanges([this.getCurrentSettings()]);this._oProviderCard._editorManifest=M;var n=this;this._oProviderCard._fillFiltersModel=function(){if(!n._oProviderCard._oDataProviderFactory){return;}n._bIgnoreUpdates=true;for(var i=0;i<a.length;i++){var o=a[i];o.config._cancel=false;n._addValueListModel(o.config,o.field,true);}n._bIgnoreUpdates=false;};this._oProviderCard.setVisible(false);this._oProviderCard.onBeforeRendering();if(j&&j!==this._oEditorCard){j.destroy();}}};y.prototype._createField=function(o){var F=new y.Fields[o.type]({configuration:o,mode:this.getMode(),host:this._oEditorCard.getHostInstance(),objectBindings:{currentSettings:{path:"currentSettings>"+o._settingspath},items:{path:"items>/form/items"}},visible:o.visible});this._aFieldReadyPromise.push(F._readyPromise);var B=this._settingsModel.bindProperty(o._settingspath+"/value");B.attachChange(function(){if(!this._bIgnoreUpdates){o._changed=true;if(o._dependentFields&&o._dependentFields.length>0){this._updateProviderCard(o._dependentFields);}this._updatePreview();}}.bind(this));this._addValueListModel(o,F);F._cols=o.cols||2;return F;};y.prototype._addValueListModel=function(o,F,a){if(o.enum&&o.enum.length>0&&o.enum[0]!==""){o.enum=[""].concat(o.enum);}if(o.values&&o.values.data&&this._oProviderCard&&this._oProviderCard._oDataProviderFactory){var V=new J({}),j=this._oProviderCard._oDataProviderFactory.create(o.values.data).getData();this._settingsModel.setProperty(o._settingspath+"/_loading",true);j.then(function(H){if(o._cancel){o._values=[];return;}var K=o.values.data.path;if(K&&K!=="/"){if(K.startsWith("/")){K=K.substring(1);}if(K.endsWith("/")){K=K.substring(0,K.length-1);}var M=K.split("/");var N=O.get(M,H);if(Array.isArray(N)&&N.length>0&&o.type!=="string[]"){N=[{}].concat(N);O.set(M,N,H);}}else if(Array.isArray(H)&&H.length>0&&o.type!=="string[]"){H=[{}].concat(H);}o._values=H;V.setData(H);V.checkUpdate(true);this._settingsModel.setProperty(o._settingspath+"/_loading",false);}.bind(this)).catch(function(){o._values={};V.setData({});V.checkUpdate(true);this._settingsModel.setProperty(o._settingspath+"/_loading",false);}.bind(this));F.setModel(V,undefined);F.bindObject({path:o.values.data.path||"/"});if(!a){var s=JSON.stringify(o.values.data);if(s){var n=/parameters\.([^\}\}]+)|destinations\.([^\}\}]+)/g,z=s.match(n);if(z){for(var i=0;i<z.length;i++){var B=z[i].indexOf("parameters.")===0?"/value":"/name",E="/sap.card/configuration/"+z[i].replace(".","/")+B,G=this._mItemsByPaths[E];if(G){G._dependentFields=G._dependentFields||[];G._dependentFields.push({field:F,config:o});}}}}}}};y.prototype._addItem=function(o){var M=this.getMode();if(this.getAllowDynamicValues()===false||!o.allowDynamicValues){o.allowDynamicValues=false;}if(this.getAllowSettings()===false){o.allowSettings=false;}o._beforeValue=this._beforeManifestModel.getProperty(o.manifestpath);o.__cols=o.cols||2;if(o.visible===false||(!o.translatable&&M==="translation")){return;}if(o.type==="group"){var a=new T({text:o.label,visible:o.visible,objectBindings:{currentSettings:{path:"currentSettings>"+o._settingspath},items:{path:"items>/form/items"}}});this.addAggregation("_formContent",a);a._cols=o.cols||2;return;}if(M==="translation"){if(typeof o.value==="string"&&o.value.indexOf("{")===0){return;}o._language={value:o.value};o.cols=1;var i=d(o,10);i._settingspath+="/_language";i.editable=false;i.required=false;i.value=i._beforeValue;if(!i.value){i.value="-";}this.addAggregation("_formContent",this._createLabel(i));this.addAggregation("_formContent",this._createField(i));o.value=o._translatedDefaultValue||"";o.editable=o.visible=o.translatable;if(this._currentLayerManifestChanges){o.value=this._currentLayerManifestChanges[o.manifestpath]||o.value;}o.label=o._translatedLabel||"";o.required=false;}this.addAggregation("_formContent",this._createLabel(o));var F=this._createField(o);this.addAggregation("_formContent",F);o.cols=o.__cols;delete o.__cols;};y.prototype._getCurrentLanguageSpecificText=function(K){var s=this._language;if(this._oTranslationBundle){var a=this._oTranslationBundle.getText(K,[],true);if(a===undefined){return"";}return a;}if(!s){return"";}var i=this._oEditorCard.getManifestEntry("/sap.app/i18n");if(!i){return"";}if(typeof i==="string"){var F=[s];if(s.indexOf("_")>-1){F.push(s.substring(0,s.indexOf("_")));}this._oTranslationBundle=k.create({url:this._getBaseUrl()+i,async:false,locale:s,supportedLocales:F,fallbackLocale:""});return this._getCurrentLanguageSpecificText(K);}};y.prototype._getBaseUrl=function(){if(this._oEditorCard&&this._oEditorCard.isReady()){return this._oEditorCard.getBaseUrl()||this.oCardEditor._oEditorCard._oCardManifest.getUrl();}return"";};y.prototype._startEditor=function(){var s=this._settingsModel.getProperty("/");if(s.form&&s.form.items){if(this.getMode()==="translation"){this._addItem({type:"group",cols:1,translatable:true,label:x.getText("CARDEDITOR_ORIGINALLANG")});this._addItem({type:"group",cols:1,translatable:true,label:y._languages[this._language]||this.getLanguage()});}this._mItemsByPaths={};for(var n in s.form.items){var i=s.form.items[n];if(i.manifestpath){this._mItemsByPaths[i.manifestpath]=i;}if(i){i.label=i.label||n;var a=this._currentLayerManifestChanges[i.manifestpath];i._changed=a!==undefined;if(i.type==="string"){i._translatedDefaultPlaceholder=this._getManifestDefaultValue(i.manifestpath)||i.defaultValue;var j=null,o=i._translatedDefaultPlaceholder;if(o){if(this._isValueWithHandlebarsTranslation(o)){j=o.substring(2,o.length-2);}else if(o.startsWith("{i18n>")){j=o.substring(6,o.length-1);}if(j){i.translatable=true;i._translatedDefaultValue=this.getModel("i18n").getResourceBundle().getText(j);if(i._changed){i.value=a;}else{i.value=i._translatedDefaultValue;}if(this.getMode()==="translation"){i._translatedDefaultValue=this._getCurrentLanguageSpecificText(j);}}}if(this.getMode()==="translation"){if(this._isValueWithHandlebarsTranslation(i.label)){i._translatedLabel=this._getCurrentLanguageSpecificText(i.label.substring(2,i.label.length-2),true);}else if(i.label&&i.label.startsWith("{i18n>")){i._translatedLabel=this._getCurrentLanguageSpecificText(i.label.substring(6,i.label.length-1),true);}}}}}}for(var n in s.form.items){var i=s.form.items[n];this._addItem(i);}if(this.getMode()!=="translation"){this._initPreview().then(function(){Promise.all(this._aFieldReadyPromise).then(function(){this._ready=true;this.fireReady();}.bind(this));}.bind(this));}else{Promise.all(this._aFieldReadyPromise).then(function(){this._ready=true;this.fireReady();}.bind(this));}};y.prototype.destroy=function(){if(this._oEditorCard){this._oEditorCard.destroy();}if(this._oPopover){this._oPopover.destroy();}if(this._oDesigntimeInstance){this._oDesigntimeInstance.destroy();}this._manifestModel=null;this._originalManifestModel=null;this._settingsModel=null;C.prototype.destroy.apply(this,arguments);};y.prototype._initPreview=function(){return new Promise(function(a,i){sap.ui.require(["sap/ui/integration/designtime/editor/CardPreview"],function(j){var o=new j({settings:this._oDesigntimeInstance.getSettings(),card:this._oEditorCard});this.setAggregation("_preview",o);a();}.bind(this));}.bind(this));};y.prototype._updatePreview=function(){var o=this.getAggregation("_preview");if(o){o.update();}};y.prototype._applyDesigntimeDefaults=function(s){s=s||{};s.form=s.form||{};s.form.items=s.form.items||{};s.preview=s.preview||{modes:"Abstract"};var i=s.form.items||s.form.items;for(var n in i){var o=i[n];if(o.manifestpath){o.value=this._manifestModel.getProperty(o.manifestpath);}if(o.visible===undefined||o.visible===null){o.visible=true;}if(typeof o.translatable!=="boolean"){o.translatable=false;}if(o.editable===undefined||o.editable===null){o.editable=true;}if(!o.label){o.label=n;}if(!o.type||o.type==="enum"){o.type="string";}if(o.value===undefined||o.value===null){switch(o.type){case"boolean":o.value=o.defaultValue||false;break;case"integer":case"number":o.value=o.defaultValue||0;break;case"string[]":o.value=o.defaultValue||[];break;default:o.value=o.defaultValue||"";}}if(o.type==="group"){if(o.visible===undefined||o.value===null){o.visible=true;}}o._settingspath="/form/items/"+n;}};y.prototype._applyDesigntimeLayers=function(s){if(this._appliedLayerManifestChanges&&Array.isArray(this._appliedLayerManifestChanges)){for(var i=0;i<this._appliedLayerManifestChanges.length;i++){var o=this._appliedLayerManifestChanges[i][":designtime"];if(o){var K=Object.keys(o);for(var j=0;j<K.length;j++){this._settingsModel.setProperty(K[j],o[K[j]]);}}}}if(this._currentLayerManifestChanges){var o=this._currentLayerManifestChanges[":designtime"];if(o){var K=Object.keys(o);for(var j=0;j<K.length;j++){var a=K[j],n=a.substring(0,a.lastIndexOf("/")+1)+"_next";if(!this._settingsModel.getProperty(n)){this._settingsModel.setProperty(n,{});}var n=a.substring(0,a.lastIndexOf("/")+1)+"_next",z=a.substring(a.lastIndexOf("/")+1);this._settingsModel.setProperty(n+"/"+z,o[K[j]]);}}}};y.prototype._createParameterDesigntime=function(o){var s={},B="/sap.card/configuration/parameters/",M=this.getMode();if(o&&o.parameters){s.form=s.form||{};s.form.items=s.form.items||{};var i=s.form.items;Object.keys(o.parameters).forEach(function(n){i[n]=m({manifestpath:B+n+"/value",editable:(M!=="translation"),_settingspath:"/form/items/"+n},o.parameters[n]);var a=i[n];if(!a.type){a.type="string";}if(!a.hasOwnProperty("visible")){a.visible=true;}});}return new D(s);};y.prototype._addDestinationSettings=function(o){var s=this._oDesigntimeInstance.getSettings(),B="/sap.card/configuration/destinations/";s.form=s.form||{};s.form.items=s.form.items||{};if(s&&o&&o.destinations){if(!s.form.items["destination.group"]){s.form.items["destination.group"]={label:x.getText("CARDEDITOR_DESTINATIONS")||"Destinations",type:"group",visible:true};}var i=s.form.items;Object.keys(o.destinations).forEach(function(n){var _=[{}],H=this._oEditorCard.getHostInstance();i[n+".destinaton"]=m({manifestpath:B+n+"/name",visible:true,type:"destination",editable:true,allowDynamicValues:false,allowSettings:false,value:o.destinations[n].name,defaultValue:o.destinations[n].defaultUrl,_settingspath:"/form/items/"+[n+".destinaton"],_values:_,_destinationName:n},o.destinations[n]);if(typeof i[n+".destinaton"].label==="undefined"){i[n+".destinaton"].label=n;}if(H){i[n+".destinaton"]._loading=true;this._oEditorCard.getHostInstance().getDestinations().then(function(n,a){i[n+".destinaton"]._values=_.concat(a);i[n+".destinaton"]._loading=false;this._settingsModel.checkUpdate(true);i[n+".destinaton"].value=o.destinations[n].name;}.bind(this,n));}}.bind(this));}};y.prototype._getManifestDefaultValue=function(s){return this._originalManifestModel.getProperty(s);};y.prototype._isValueWithHandlebarsTranslation=function(V){if(typeof V==="string"){return!!V.match(v);}return false;};y._contextEntries={empty:{label:x.getText("CARDEDITOR_CONTEXT_EMPTY_VAL"),type:"string",description:x.getText("CARDEDITOR_CONTEXT_EMPTY_DESC"),placeholder:"",value:""},"card.internal":{label:x.getText("CARDEDITOR_CONTEXT_CARD_INTERNAL_VAL"),todayIso:{type:"string",label:x.getText("CARDEDITOR_CONTEXT_CARD_TODAY_VAL"),description:x.getText("CARDEDITOR_CONTEXT_CARD_TODAY_DESC"),tags:[],placeholder:x.getText("CARDEDITOR_CONTEXT_CARD_TODAY_VAL"),customize:["format.dataTime"],value:"{{parameters.TODAY_ISO}}"},nowIso:{type:"string",label:x.getText("CARDEDITOR_CONTEXT_CARD_NOW_VAL"),description:x.getText("CARDEDITOR_CONTEXT_CARD_NOW_DESC"),tags:[],placeholder:x.getText("CARDEDITOR_CONTEXT_CARD_NOW_VAL"),customize:["dateFormatters"],value:"{{parameters.NOW_ISO}}"},currentLanguage:{type:"string",label:x.getText("CARDEDITOR_CONTEXT_CARD_LANG_VAL"),description:x.getText("CARDEDITOR_CONTEXT_CARD_LANG_VAL"),tags:["technical"],customize:["languageFormatters"],placeholder:x.getText("CARDEDITOR_CONTEXT_CARD_LANG_VAL"),value:"{{parameters.LOCALE}}"}}};y._languages={};y._appendThemeVars=function(){var o=document.getElementById("sap-ui-integration-editor-style");if(o&&o.parentNode){o.parentNode.removeChild(o);}var V=["sapUiButtonHoverBackground","sapUiBaseBG","sapUiContentLabelColor","sapUiTileSeparatorColor","sapUiHighlight","sapUiListSelectionBackgroundColor","sapUiChartScrollbarBorderColor"],s=document.createElement("style");s.setAttribute("id","sap-ui-integration-editor-style");for(var i=0;i<V.length;i++){V[i]="--"+V[i]+":"+q.get(V[i]);}s.innerHTML=".sapUiIntegrationCardEditor, .sapUiIntegrationFieldSettings, .sapUiIntegrationIconSelectList {"+V.join(";")+"}";document.body.appendChild(s);};y.init=function(){this.init=function(){};y._appendThemeVars();b.attachThemeChanged(function(){y._appendThemeVars();});var s=sap.ui.require.toUrl("sap.ui.integration.designtime.editor.css.CardEditor".replace(/\./g,"/")+".css");l(s);p.loadResource("sap/ui/integration/designtime/editor/languages.json",{dataType:"json",failOnError:false,async:true}).then(function(o){y._languages=o;});};y.init();return y;});
