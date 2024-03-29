/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"ui5loader",
	"sap/ui/core/Control",
	"sap/ui/core/Core",
	"sap/base/util/deepClone",
	"sap/base/util/merge",
	"sap/ui/integration/widgets/Card",
	"sap/ui/integration/Designtime",
	"sap/ui/model/json/JSONModel",
	"sap/ui/integration/util/CardMerger",
	"sap/m/Label",
	"sap/m/Title",
	"sap/ui/core/Icon",
	"sap/m/ResponsivePopover",
	"sap/m/Popover",
	"sap/m/Text",
	"sap/base/Log",
	"sap/ui/core/Popup",
	"sap/base/i18n/ResourceBundle",
	"sap/ui/thirdparty/URI",
	"sap/ui/dom/includeStylesheet",
	"sap/base/util/LoaderExtensions",
	"sap/ui/core/theming/Parameters",
	"sap/base/util/ObjectPath"
], function (
	ui5loader,
	Control,
	Core,
	deepClone,
	merge,
	Card,
	Designtime,
	JSONModel,
	CardMerger,
	Label,
	Title,
	Icon,
	RPopover,
	Popover,
	Text,
	Log,
	Popup,
	ResourceBundle,
	URI,
	includeStylesheet,
	LoaderExtension,
	Parameters,
	ObjectPath
) {
	"use strict";


	//workaround issue of orientation change fired that reapplies position and closes the popup
	//issue is not predictable and depends on host environment. Solution - apply all, simply do not close for position changes.
	var popoverInit = Popover.prototype.init;
	Popover.prototype.init = function () {
		popoverInit.apply(this, arguments);
		var fn = this.oPopup._applyPosition,
			that = this;
		this.oPopup._applyPosition = function () {
			var fnClose = that.close;
			that.close = function () { };
			fn.apply(this, arguments);
			that.close = fnClose;
		};
	};

	function getHigherZIndex(source) {
		if (source && source.nodeType !== 1) {
			return 0;
		}
		var z = parseInt(window.getComputedStyle(source).getPropertyValue('z-index'));
		if (isNaN(z)) {
			return getHigherZIndex(source.parentNode);
		}
		return z + 1;
	}
	var REGEXP_TRANSLATABLE = /\{\{(?!parameters.)(?!destinations.)([^\}\}]+)\}\}/g,
		CONTEXT_TIMEOUT = 5000,
		oResourceBundle = Core.getLibraryResourceBundle("sap.ui.integration");

	/**
	 * Constructor for a new <code>Card Editor</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * A control allows to edit manifest settings for a card based on a configuration from a designtime module.
	 *
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.84.12
	 * @constructor
	 * @see {@link topic:5b46b03f024542ba802d99d67bc1a3f4 Cards}
	 * @since 1.83
	 * @private
	 * @experimental since 1.83.0
	 * @alias sap.ui.integration.designtime.CardEditor
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CardEditor = Control.extend("sap.ui.integration.designtime.editor.CardEditor", /** @lends sap.ui.integration.designtime.editor.CardEditor.prototype */ {
		metadata: {
			library: "sap.ui.integration",
			properties: {
				/**
				 * Set an id to an already existing card instance as string or provide the settings for a card as an object
				 * {
				 *    manifest:        manifest for the card as a json object
				 *    baseUrl:         base url for the card
				 *    ...
				 * }
				 * Depending on the scenario there is a card instance already available. In this case an id to this card instance
				 * should be provided, to avoid an additional card instance creation.
				 */
				card: {
					type: "any",
					defaultValue: null
				},
				/**
				 * admin, content, translation
				 * Used to control the editors capabilities
				 */
				mode: {
					type: "string",
					defaultValue: "admin"
				},
				language: {
					type: "string",
					defaultValue: ""
				},
				allowDynamicValues: {
					type: "boolean",
					defaultValue: false
				},
				allowSettings: {
					type: "boolean",
					defaultValue: false
				},
				designtime: {
					type: "object"
				}
			},
			aggregations: {
				/**
				 * Defines the header of the card.
				 */
				_formContent: {
					type: "sap.ui.core.Control",
					multiple: true,
					visibility: "hidden"
				},
				_preview: {
					type: "sap.ui.integration.designtime.editor.CardPreview",
					multiple: false,
					visibility: "hidden"
				}
			},
			events: {
				ready: {}
			}
		},
		renderer: function (oRm, oControl) {
			//surrounding div tag <div class="sapUiIntegrationCardEditor sapUiIntegrationCardEditor(Translation|Preview)"
			oRm.openStart("div");
			oControl.getMode() === "translation" ? oRm.addClass("sapUiIntegrationCardEditorTranslation") : oRm.addClass("sapUiIntegrationCardEditorPreview");
			oRm.addClass("sapUiIntegrationCardEditor");
			oRm.writeClasses();
			oRm.writeElementData(oControl);
			oRm.openEnd();
			if (oControl.isReady()) {
				//surrounding div tag for form <div class="sapUiIntegrationCardEditorForm"
				oRm.openStart("div");
				oRm.addClass("sapUiIntegrationCardEditorForm");
				if (oControl.getMode() !== "translation") {
					oRm.addClass("settingsButtonSpace");
				}
				oRm.writeClasses();
				oRm.openEnd();
				var aItems = oControl.getAggregation("_formContent");
				//render items
				if (aItems) {
					var oLabel,
						iCol = 0;
					for (var i = 0; i < aItems.length; i++) {
						var oItem = aItems[i];
						if (oItem.isA("sap.m.Label")) {
							oLabel = oItem; //store the label and render it together with the next field
							continue;
						}
						oRm.openStart("div");
						oRm.addClass("sapUiIntegrationCardEditorItem");
						if (oControl.getMode() === "translation") {
							oRm.addClass("language");
						}
						//if multiple cols are used in the form, set class sapUiIntegrationCardEditorItemCol1 or sapUiIntegrationCardEditorItemCol2
						if (oItem._cols === 1) {
							oRm.addClass("sapUiIntegrationCardEditorItemCol" + (++iCol));
						} else {
							iCol = 0;
						}
						oRm.writeClasses();
						oRm.openEnd();
						if (oItem.isA("sap.m.Title")) {
							oRm.renderControl(oItem);
						} else {
							//render label and field
							if (oLabel) {
								var oDependent = oLabel.getDependents() && oLabel.getDependents()[0];
								oRm.openStart("div");
								oRm.addClass("sapUiIntegrationCardEditorItemLabel");
								if (oDependent && oControl.getMode() !== "translation") {
									oRm.addClass("description");
								}
								oRm.openEnd();
								oRm.renderControl(oLabel);
								if (oDependent) {
									oRm.renderControl(oDependent);
								}
								oRm.close("div");
							}
							oRm.renderControl(oItem);
						}
						oRm.close("div");
						oLabel = null; //reset the label
						iCol = iCol == 2 ? 0 : iCol; //reset the cols if 2, we only support 2 cols currently
					}
				}
				oRm.close("div");
				//render the preview
				var oPreview = oControl.getAggregation("_preview");
				oPreview && oRm.renderControl(oPreview);
			}
			oRm.close("div");
		}
	});
	/**
		 * Init of the editor
		 */
	CardEditor.prototype.init = function () {
		this._ready = false;
		this._aFieldReadyPromise = [];
		//load translations
		this._oResourceBundle = oResourceBundle;
		this._appliedLayerManifestChanges = [];
		this._currentLayerManifestChanges = {};
		this._mDestinationDataProviders = {};
	};
	/**
	 * Returns whether the editor is ready to be used
	 */
	CardEditor.prototype.isReady = function () {
		return this._ready;
	};


	function flattenData(oData, s, a, path) {
		path = path || "";
		a = a || [];
		if (typeof oData === "object") {
			if (!oData[s]) {
				for (var n in oData) {
					flattenData(oData[n], s, a, path + "/" + n);
				}
			} else {
				//found leave
				if (oData.type) {
					a.push({
						path: oData.pathvalue || path.substring(1),
						value: oData.pathvalue || "{context>" + path.substring(1) + "/value}",
						object: oData
					});
				} else {
					a.push({
						path: path.substring(1),
						object: oData
					});
					for (var n in oData) {
						flattenData(oData[n], s, a, path + "/" + n);
					}
				}
			}
		}
		return a;
	}

	/**
	 * Filters the manifestChanges array in the oManifestSettings
	 * All changes that are done for layers > than current layer are removed (see also CardMerger.layers)
	 * The current layers changes are stored in this._currentLayerManifestChanges to be applied later in the editor code.
	 * All changes that are done for layers < that the current layer are kept in oManifestSettings.manifestChanges
	 *
	 * @param {*} oManifestSettings
	 */
	CardEditor.prototype._filterManifestChangesByLayer = function (oManifestSettings) {
		var aChanges = [],
			oCurrentLayerChanges = { ":layer": CardMerger.layers[this.getMode()] },
			iCurrentModeIndex = CardMerger.layers[this.getMode()];
		oManifestSettings.manifestChanges.forEach(function (oChange) {
			//filter manifest changes. only the changes before the current layer are needed
			//card editor will merge the last layer locally to allow "reset" or properties
			//also for translation layer, the "original" value is needed
			var iLayer = oChange.hasOwnProperty(":layer") ? oChange[":layer"] : 1000;
			if (iLayer < iCurrentModeIndex) {
				aChanges.push(oChange);
			} else if (iLayer === iCurrentModeIndex) {
				//store the current layer changes locally for later processing
				oCurrentLayerChanges = oChange;
			}
		});
		oManifestSettings.manifestChanges = aChanges;
		this._currentLayerManifestChanges = oCurrentLayerChanges;
	};
	/**
	 * Sets the card property as a string, object {manifest:{}, baseUrl:{}} or a reference to a card instance
	 * @param {any} vCardIdOrSettings
	 * @param {boolean} bSuppressRerendering
	 */
	CardEditor.prototype.setCard = function (vCardIdOrSettings, bSuppressRerendering) {
		this._ready = false;
		if (vCardIdOrSettings === this.getProperty("card")) {
			return this;
		}
		if (this._oEditorCard) {
			this._oEditorCard.destroy();
		}
		if (this._oDesigntimeInstance) {
			this._oDesigntimeInstance.destroy();
		}
		this.setProperty("card", vCardIdOrSettings, bSuppressRerendering);
		//Waiting for additional settings on the card that are applied synchronously
		Promise.resolve().then(function () {
			this._initCard(vCardIdOrSettings);
		}.bind(this));
		return this;
	};
	/**
	 * Sets the language of the editor
	 *
	 * @param {string} sValue the language in the format language_region or language-region
	 * @param {*} bSuppress suppress rerendering of the editor
	 */
	CardEditor.prototype.setLanguage = function (sValue, bSuppress) {
		//unify the language-region to language_region
		if (!sValue || typeof sValue !== "string") {
			return this;
		}
		this._language = sValue.replace("-", "_");
		this.setProperty("language", sValue, bSuppress);
		if (!CardEditor._languages[this._language]) {
			this._language = this._language.split("_")[0];
		}
		if (!CardEditor._languages[this._language]) {
			Log.warning("The language: " + sValue + " is currently unknown, some UI controls might show " + sValue + " instead of the language name.");
		}
		return this;
	};
	/**
	 * Increases the zIndex to a higher value for all popups
	 */
	CardEditor.prototype.onAfterRendering = function () {
		if (this.getDomRef()) {
			this._iZIndex = getHigherZIndex(this.getDomRef());
			Popup.setInitialZIndex(this._iZIndex);
		}
	};
	/**
	 * Returns the original manifest json without processed parameters, handlebar translation
	 */
	CardEditor.prototype._getOriginalManifestJson = function () {
		try {
			return this._oEditorCard._oCardManifest._oManifest.getRawJson();
		} catch (ex) {
			return {};
		}
	};
	/**
	 * Initializes the editors card settings
	 * @param {} vCardIdOrSettings
	 */
	CardEditor.prototype._initCard = function (vCardIdOrSettings) {
		if (typeof vCardIdOrSettings === "string") {
			try {
				vCardIdOrSettings = JSON.parse(vCardIdOrSettings);
			} catch (ex) {
				//not json
				//could be a card instance id
				var instance = Core.byId(vCardIdOrSettings);
				if (!instance) { //not a card instance, but a string
					//could be a card dom element id
					var element = document.getElementById(vCardIdOrSettings);
					if (element && element.tagName && element.tagName === "ui-integration-card") {
						instance = element._getControl();
					}
				}
				vCardIdOrSettings = instance;
			}
		}
		if (vCardIdOrSettings && vCardIdOrSettings.isA && vCardIdOrSettings.isA("sap.ui.integration.widgets.Card")) {
			//a card instance
			vCardIdOrSettings = {
				manifest: vCardIdOrSettings.getManifest(),
				manifestChanges: vCardIdOrSettings.getManifestChanges(),
				host: vCardIdOrSettings.getHost(),
				baseUrl: vCardIdOrSettings.getBaseUrl()
			};
		}
		if (typeof vCardIdOrSettings === "object") {
			var iCurrentModeIndex = CardMerger.layers[this.getMode()];
			if (vCardIdOrSettings.manifestChanges) {
				//remove the changes from the current layer
				this._filterManifestChangesByLayer(vCardIdOrSettings);
			}
			//create a new card settings for a new card
			this._oEditorCard = new Card(vCardIdOrSettings);
			var that = this;
			this._oEditorCard._prepareToApplyManifestSettings = function () {
				Card.prototype._prepareToApplyManifestSettings.apply(this, arguments);
				if (!that._oEditorCard._isManifestReady) {
					//TODO: manifestReady is fired even if the manifest is not ready. Check why.
					return;
				}
				if (that._manifestModel) {
					//already created
					return;
				}
				that._appliedLayerManifestChanges = vCardIdOrSettings.manifestChanges;
				var oManifestData = that._oEditorCard.getManifestEntry("/");
				var _beforeCurrentLayer = merge({}, oManifestData);
				that._oProviderCard = that._oEditorCard;
				that._oProviderCard._editorManifest = oManifestData;
				that._beforeManifestModel = new JSONModel(_beforeCurrentLayer);
				if (iCurrentModeIndex < CardMerger.layers["translation"] && that._currentLayerManifestChanges) {
					//merge if not translation

					oManifestData = CardMerger.mergeCardDelta(oManifestData, [that._currentLayerManifestChanges]);
				}
				//create a manifest model after the changes are merged
				that._manifestModel = new JSONModel(oManifestData);
				//create a manifest model for the original "raw" manifest that was initially loaded

				that._originalManifestModel = new JSONModel(that._getOriginalManifestJson());
				that._initInternal();
				//use the translations from the card
				if (!that._oEditorCard.getModel("i18n")) {
					that._oEditorCard._loadDefaultTranslations();
				}
				that.setModel(that._oEditorCard.getModel("i18n"), "i18n");
				//add a context model
				that._createContextModel();
			};
			this._oEditorCard.onBeforeRendering();
		}
	};
	/**
	 * Initializes the editor after the card is set
	 */
	CardEditor.prototype._initInternal = function () {
		//load the designtime control and bundles lazy
		var sDesigntime = this._oEditorCard.getManifestEntry("/sap.card/designtime"),
			oConfiguration = this._manifestModel.getProperty("/sap.card/configuration"),
			oPromise,
			oDesigntimeConfig = this.getDesigntime();
		if (oDesigntimeConfig) {
			if (typeof oDesigntimeConfig === "function") {
				oPromise = new Promise(function (resolve, reject) {
					var oDesigntimeInstance = new oDesigntimeConfig();
					this._applyDesigntimeDefaults(oDesigntimeInstance.getSettings());
					resolve(oDesigntimeInstance);
				}.bind(this));
			} else if (typeof oDesigntimeConfig === "object") {
				oPromise = new Promise(function (resolve, reject) {
					sap.ui.require(["sap/ui/integration/Designtime"], function (Designtime) {
						var AdvancedDesigntime = Designtime.extend("test.Designtime");
						AdvancedDesigntime.prototype.create = function () {
							return oDesigntimeConfig;
						};
						var oDesigntime = new AdvancedDesigntime();
						this._applyDesigntimeDefaults(oDesigntime.getSettings());
						resolve(oDesigntime);
					}.bind(this));
				}.bind(this));
			}
		} else if (sDesigntime) {
			//load designtime from module
			oPromise = this._oEditorCard.loadDesigntime().then(function (oDesigntime) {
				this._applyDesigntimeDefaults(oDesigntime.getSettings());
				return oDesigntime;
			}.bind(this));
		} else {
			//stay compatible and create designtime configuration based on parameters/destinations
			oPromise = Promise.resolve(this._createParameterDesigntime(oConfiguration));
		}
		oPromise.then(function (oDesigntime) {
			this._oDesigntimeInstance = oDesigntime;
			if (this.getMode() === "admin" || this.getMode() === "all") {
				//always add destination settings
				this._addDestinationSettings(oConfiguration, this._oDesigntimeInstance);
			}
			//create a settings model
			this._settingsModel = new JSONModel(this._oDesigntimeInstance.getSettings());
			this.setModel(this._settingsModel, "currentSettings");
			this.setModel(this._settingsModel, "items");
			this._applyDesigntimeLayers(); //changes done from admin to content on the dt values
			this._requireFields().then(function () {
				this._startEditor();
			}.bind(this));
		}.bind(this));
	};
	/**
	 * Returns the current settings as a json with a manifest path and the current value
	 * additionally there is a layer number added as ":layer"
	 */
	CardEditor.prototype.getCurrentSettings = function () {
		var oSettings = this._settingsModel.getProperty("/"),
			mResult = {},
			mNext;
		if (oSettings && oSettings.form && oSettings.form.items) {
			for (var n in oSettings.form.items) {
				var oItem = oSettings.form.items[n];
				if (oItem.editable && oItem.visible) {
					if (this.getMode() !== "translation") {
						if (oItem.translatable && !oItem._changed && oItem._translatedDefaultPlaceholder && !this._currentLayerManifestChanges[oItem.manifestPath]) {
							//do not save a value that was not changed and comes from a translated default value
							//mResult[oItem.manifestpath] = oItem._translatedDefaultPlaceholder;
							//if we would save it
							continue;
						} else {
							mResult[oItem.manifestpath] = oItem.value;
						}
					} else if (oItem.translatable && oItem.value) {
						//in translation mode create an entry if there is a value
						mResult[oItem.manifestpath] = oItem.value;
					}
					if (oItem._next && (this.getAllowSettings())) {
						if (oItem._next.editable === false) {
							mNext = mNext || {};
							mNext[oItem._settingspath + "/editable"] = false;
						}
						if (oItem._next.visible === false) {
							mNext = mNext || {};
							mNext[oItem._settingspath + "/visible"] = false;
						}
						if (typeof oItem._next.allowDynamicValues === "boolean" && this.getAllowDynamicValues()) {
							mNext = mNext || {};
							mNext[oItem._settingspath + "/allowDynamicValues"] = oItem._next.allowDynamicValues;
						}
					}
				}
			}
		}

		mResult[":layer"] = CardMerger.layers[this.getMode()];
		mResult[":errors"] = this.checkCurrentSettings()[":errors"];
		if (mNext) {
			mResult[":designtime"] = mNext;
		}
		return mResult;
	};
	/**
	 * Checks for invalid values in the current settings and reports the errors
	 * TODO: highlight issues and add states...
	 */
	CardEditor.prototype.checkCurrentSettings = function () {
		var oSettings = this._settingsModel.getProperty("/"),
			mChecks = {};
		if (oSettings && oSettings.form && oSettings.form.items) {
			for (var n in oSettings.form.items) {
				var oItem = oSettings.form.items[n];
				if (oItem.editable) {
					if ((oItem.isValid || oItem.required) && !(this.getMode() === "translation" && oItem.translatable)) {
						if (oItem.isValid) {
							mChecks[oItem.manifestpath] = oItem.isValid(oItem);
						}
						mChecks[oItem.manifestpath] = true;
						var value = oItem.value;
						var sType = oItem.type;
						if (sType === "string" && value === "") {
							mChecks[oItem.manifestpath] = value;
							//inform user of this error
						}
						if ((sType === "date" || sType === "datetime") && isNaN(Date.parse(value))) {
							mChecks[oItem.manifestpath] = value;
							//inform user of this error
						}
						if (sType === "integer") {
							if (isNaN(parseInt(value))) {
								mChecks[oItem.manifestpath] = value;
								//inform user of this error
							} else if (value < oItem.min || value > oItem.max) {
								mChecks[oItem.manifestpath] = value;
								//inform user of this error
							}
						} if (sType === "number") {
							if (isNaN(parseFloat(value))) {
								mChecks[oItem.manifestpath] = value;
							} else if (value < oItem.min || value > oItem.max) {
								mChecks[oItem.manifestpath] = value;
							}
						}
					}
				}
			}
			mChecks[":layer"] = CardMerger.layers[this.getMode()];
		}
		mChecks[":errors"] = Object.values(mChecks).indexOf(false) > -1;
		return mChecks;
	};

	/**
	 * Creates a model for the context object of the host environment
	 */
	CardEditor.prototype._createContextModel = function () {
		var oHost = this._oEditorCard.getHostInstance(),
			oContextModel = new JSONModel({}),
			oFlatContextModel = new JSONModel([]);

		//add the models in any case
		this.setModel(oContextModel, "context");
		this.setModel(oFlatContextModel, "contextflat");
		oFlatContextModel._getPathObject = function (sPath) {
			var a = this.getData().filter(function (o) {
				if (o.path === sPath) {
					return true;
				}
			});
			return a.length ? a[0] : null;
		};
		oFlatContextModel._getValueObject = function (sValue) {
			var a = this.getData() || [];
			a = a.filter(function (o) {
				if (o.value === sValue || o.object.value === sValue) {
					return true;
				}
			});
			return a.length ? a[0] : null;
		};
		var oContextDataPromise = new Promise(function (resolve, reject) {
			if (oHost && oHost.getContext) {
				var bResolved = false;
				setTimeout(function () {
					if (bResolved) {
						return;
					}
					Log.error("Card Editor context could not be determined with " + CONTEXT_TIMEOUT + ".");
					bResolved = true;
					resolve({});
				}, CONTEXT_TIMEOUT);
				oHost.getContext().then(function (oContextData) {
					if (bResolved) {
						Log.error("Card Editor context returned after more than " + CONTEXT_TIMEOUT + ". Context is ignored.");
					}
					bResolved = true;
					resolve(oContextData || {});
				});
			} else {
				resolve({});
			}
		});

		//get the context from the host
		oContextDataPromise.then(function (oContextData) {
			var oData = {};
			//empty entry
			oData["empty"] = CardEditor._contextEntries.empty;
			//custom entries
			for (var n in oContextData) {
				oData[n] = oContextData[n];
			}
			//card internal
			oData["card.internal"] = CardEditor._contextEntries["card.internal"];
			oContextModel.setData(oData);
			oFlatContextModel.setData(flattenData(oData, "label"));
		});

		//async update of the value via host call
		oContextModel.getProperty = function (sPath, oContext) {
			var sAbsolutePath = this.resolve(sPath, oContext);
			if (sAbsolutePath.endsWith("/value")) {
				this._mValues = this._mValues || {};
				if (this._mValues.hasOwnProperty(sAbsolutePath)) {
					return this._mValues[sAbsolutePath];
					//when should this be invalidated?
				}
				this._mValues[sAbsolutePath] = undefined;
				//ask the host
				oHost.getContextValue(sAbsolutePath.substring(1)).then(function (vValue) {
					this._mValues[sAbsolutePath] = vValue;
					this.checkUpdate();
				}.bind(this));
				return undefined;
			} else {
				//resolve dt data locally
				return JSONModel.prototype.getProperty.apply(this, arguments);
			}
		};
	};
	//map editors for a specific type
	CardEditor.fieldMap = {
		"string": "sap/ui/integration/designtime/editor/fields/StringField",
		"integer": "sap/ui/integration/designtime/editor/fields/IntegerField",
		"number": "sap/ui/integration/designtime/editor/fields/NumberField",
		"boolean": "sap/ui/integration/designtime/editor/fields/BooleanField",
		"date": "sap/ui/integration/designtime/editor/fields/DateField",
		"datetime": "sap/ui/integration/designtime/editor/fields/DateTimeField",
		"string[]": "sap/ui/integration/designtime/editor/fields/ListField",
		"destination": "sap/ui/integration/designtime/editor/fields/DestinationField"
	};
	CardEditor.Fields = null;
	/**
	 * Loads all field modules registered in CardEditor.fieldMap and stores the classes in CardEditor.Fields
	 */
	CardEditor.prototype._requireFields = function () {
		if (CardEditor.Fields) {
			return Promise.resolve();
		}
		return new Promise(function (resolve) {
			sap.ui.require(Object.values(CardEditor.fieldMap), function () {
				CardEditor.Fields = {};
				for (var n in CardEditor.fieldMap) {
					CardEditor.Fields[n] = arguments[Object.keys(CardEditor.fieldMap).indexOf(n)];
				}
				resolve();
			});
		});
	};
	/**
	 * Creates a label based on the configuration settings
	 * @param {} oConfig
	 */
	CardEditor.prototype._createLabel = function (oConfig) {
		var oLabel = new Label({
			text: oConfig.label,
			//mark only fields that are required and editable,
			//otherwise this is confusing because user will not be able to correct it
			required: oConfig.required && oConfig.editable || false,
			visible: oConfig.visible,
			objectBindings: {
				currentSettings: {
					path: "currentSettings>" + oConfig._settingspath
				},
				items: {
					path: "items>/form/items"
				}
			}
		});
		oLabel._cols = oConfig.cols || 2; //by default 2 cols
		if (oConfig.description) {
			var oIcon = new Icon({
				src: "sap-icon://message-information",
				color: "Marker",
				size: "12px",
				useIconTooltip: false,
				visible: this.getMode() !== "translation"
			});
			oIcon.addStyleClass("sapUiIntegrationCardEditorDescriptionIcon");
			oLabel.addDependent(oIcon);
			oIcon.onmouseover = function () {
				this._getPopover().getContent()[0].applySettings({ text: oConfig.description });
				this._getPopover().openBy(oIcon);
				oIcon.addDependent(this._getPopover());
			}.bind(this);
			oIcon.onmouseout = function () {
				this._getPopover().close();
				oIcon.removeDependent(this._getPopover());
			}.bind(this);
		}
		return oLabel;
	};
	CardEditor.prototype._getPopover = function () {
		if (this._oPopover) {
			return this._oPopover;
		}
		var oText = new Text({
			text: ""
		});
		oText.addStyleClass("sapUiTinyMargin sapUiIntegrationCardEditorDescriptionText");
		this._oPopover = new RPopover({
			showHeader: false,
			content: [oText]
		});
		this._oPopover.addStyleClass("sapUiIntegrationCardEditorPopover");
		return this._oPopover;
	};

	CardEditor.prototype._updateProviderCard = function (aDependentFields) {
		if (this._ready) {
			var oManifestData = this._oProviderCard._editorManifest;

			if (aDependentFields.length === 0) {
				return;
			}
			for (var i = 0; i < aDependentFields.length; i++) {
				var o = aDependentFields[i];
				o.config._cancel = true;
			}
			delete oManifestData["sap.card"].header;
			delete oManifestData["sap.card"].content;
			delete oManifestData["sap.card"].data;
			oManifestData["sap.card"].type = "List";
			var oCurrentCard = this._oProviderCard;
			this._oProviderCard = new Card({
				manifest: oManifestData,
				baseUrl: this._getBaseUrl(),
				host: this._oProviderCard.getHost()
			});
			this._oProviderCard.setManifestChanges([this.getCurrentSettings()]);
			this._oProviderCard._editorManifest = oManifestData;
			var that = this;
			this._oProviderCard._fillFiltersModel = function () {
				if (!that._oProviderCard._oDataProviderFactory) {
					return;
				}
				that._bIgnoreUpdates = true;
				for (var i = 0; i < aDependentFields.length; i++) {
					var o = aDependentFields[i];
					o.config._cancel = false;
					that._addValueListModel(o.config, o.field, true);
				}
				that._bIgnoreUpdates = false;
			};
			this._oProviderCard.setVisible(false);
			this._oProviderCard.onBeforeRendering();
			if (oCurrentCard && oCurrentCard !== this._oEditorCard) {
				oCurrentCard.destroy();
			}
		}
	};

	/**
	 * Creates a Field based on the configuration settings
	 * @param {*} oConfig
	 */
	CardEditor.prototype._createField = function (oConfig) {
		var oField = new CardEditor.Fields[oConfig.type]({
			configuration: oConfig,
			mode: this.getMode(),
			host: this._oEditorCard.getHostInstance(),
			objectBindings: {
				currentSettings: {
					path: "currentSettings>" + oConfig._settingspath
				},
				items: {
					path: "items>/form/items"
				}
			},
			visible: oConfig.visible
		});

		this._aFieldReadyPromise.push(oField._readyPromise);
		//listen to changes on the settings
		var oBinding = this._settingsModel.bindProperty(oConfig._settingspath + "/value");
		oBinding.attachChange(function () {
			if (!this._bIgnoreUpdates) {
				oConfig._changed = true;
				if (oConfig._dependentFields && oConfig._dependentFields.length > 0) {
					this._updateProviderCard(oConfig._dependentFields);
				}
				this._updatePreview();
			}
		}.bind(this));
		this._addValueListModel(oConfig, oField);
		oField._cols = oConfig.cols || 2; //by default 2 cols
		return oField;
	};
	/**
	 * Creates a unnamed model if a values.data section exists in the configuration
	 * @param {object} oConfig
	 * @param {BaseField} oField
	 */
	CardEditor.prototype._addValueListModel = function (oConfig, oField, bIgnore) {
		if (oConfig.enum && oConfig.enum.length > 0 && oConfig.enum[0] !== "") {
			oConfig.enum = [""].concat(oConfig.enum);
		}
		if (oConfig.values && oConfig.values.data && this._oProviderCard && this._oProviderCard._oDataProviderFactory) {
			var oValueModel = new JSONModel({}),
				oPromise = this._oProviderCard._oDataProviderFactory.create(oConfig.values.data).getData();
			this._settingsModel.setProperty(oConfig._settingspath + "/_loading", true);
			oPromise.then(function (oData) {
				if (oConfig._cancel) {
					oConfig._values = [];
					return;
				}
				var sPath = oConfig.values.data.path;
				if (sPath && sPath !== "/") {
					if (sPath.startsWith("/")) {
						sPath = sPath.substring(1);
					}
					if (sPath.endsWith("/")) {
						sPath = sPath.substring(0, sPath.length - 1);
					}
					var aPath = sPath.split("/");
					var oResult = ObjectPath.get(aPath, oData);
					if (Array.isArray(oResult) && oResult.length > 0 && oConfig.type !== "string[]") {
						oResult = [{}].concat(oResult);
						ObjectPath.set(aPath, oResult, oData);
					}
				} else if (Array.isArray(oData) && oData.length > 0 && oConfig.type !== "string[]") {
					oData = [{}].concat(oData);
				}
				oConfig._values = oData;
				oValueModel.setData(oData);
				oValueModel.checkUpdate(true);
				this._settingsModel.setProperty(oConfig._settingspath + "/_loading", false);
			}.bind(this)).catch(function () {
				oConfig._values = {};
				oValueModel.setData({});
				oValueModel.checkUpdate(true);
				this._settingsModel.setProperty(oConfig._settingspath + "/_loading", false);
			}.bind(this));

			//in the designtime the item bindings will not use a named model, therefore we add a unnamed model for the field
			//to carry the values, also we use the binding context to connect the given path from oConfig.values.data.path
			//with that the result of the data request can be have also other structures.
			oField.setModel(oValueModel, undefined);
			oField.bindObject({
				path: oConfig.values.data.path || "/"
			});
			if (!bIgnore) {
				var sData = JSON.stringify(oConfig.values.data);
				if (sData) {
					var destParamRegExp = /parameters\.([^\}\}]+)|destinations\.([^\}\}]+)/g,
						aResult = sData.match(destParamRegExp);
					if (aResult) {
						//add the field to dependency to either the parameter or destination
						for (var i = 0; i < aResult.length; i++) {
							var sValueKey = aResult[i].indexOf("parameters.") === 0 ? "/value" : "/name",
								sDependentPath = "/sap.card/configuration/" + aResult[i].replace(".", "/") + sValueKey,
								oItem = this._mItemsByPaths[sDependentPath];
							if (oItem) {
								oItem._dependentFields = oItem._dependentFields || [];
								oItem._dependentFields.push({
									field: oField,
									config: oConfig
								});

							}
						}
					}
				}
			}
		}
	};
	/**
	 * Adds an item to the _formContent aggregation based on the config settings
	 * @param {} oConfig
	 */
	CardEditor.prototype._addItem = function (oConfig) {
		var sMode = this.getMode();
		//force to turn off features for settings and dynamic values and set the default if not configured
		if (this.getAllowDynamicValues() === false || !oConfig.allowDynamicValues) {
			oConfig.allowDynamicValues = false;
		}
		if (this.getAllowSettings() === false) {
			oConfig.allowSettings = false;
		}
		oConfig._beforeValue = this._beforeManifestModel.getProperty(oConfig.manifestpath);
		oConfig.__cols = oConfig.cols || 2;

		//if the item is not visible or translation mode, continue immediately
		if (oConfig.visible === false || (!oConfig.translatable && sMode === "translation")) {
			return;
		}
		if (oConfig.type === "group") {
			var oTitle = new Title({
				text: oConfig.label,
				visible: oConfig.visible,
				objectBindings: {
					currentSettings: {
						path: "currentSettings>" + oConfig._settingspath
					},
					items: {
						path: "items>/form/items"
					}
				}
			});
			this.addAggregation("_formContent", oTitle);
			oTitle._cols = oConfig.cols || 2; //by default 2 cols
			return;
		}
		if (sMode === "translation") {
			if (typeof oConfig.value === "string" && oConfig.value.indexOf("{") === 0) {
				//do not show dynamic values for translation
				return;
			}
			//adding an internal _language object to save the original value for the UI
			oConfig._language = {
				value: oConfig.value
			};

			//force a 2 column layout in the form, remember the original to reset

			oConfig.cols = 1;

			//create a configuration clone. map the _settingspath setting to _language, and set it to not editable
			var origLangField = deepClone(oConfig, 10);
			origLangField._settingspath += "/_language";
			origLangField.editable = false;
			origLangField.required = false;
			origLangField.value = origLangField._beforeValue;
			if (!origLangField.value) {
				//the original language field shows only a text control. If empty we show a dash to avoid empty text.
				origLangField.value = "-";
			}
			this.addAggregation("_formContent",
				this._createLabel(origLangField)
			);
			this.addAggregation("_formContent",
				this._createField(origLangField)
			);
			oConfig.value = oConfig._translatedDefaultValue || "";
			//even if a item is not visible or not editable by another layer for translations it should always be editable and visible
			oConfig.editable = oConfig.visible = oConfig.translatable;
			//if there are changes for the current layer, read the already translated value from there
			//now merge these changes for translation into the item configs
			if (this._currentLayerManifestChanges) {
				oConfig.value = this._currentLayerManifestChanges[oConfig.manifestpath] || oConfig.value;
			}
			//change the label for the translation field
			oConfig.label = oConfig._translatedLabel || "";
			oConfig.required = false; //translation is never required
			//now continue with the default...
		}
		//default for all modes
		this.addAggregation("_formContent",
			this._createLabel(oConfig)
		);
		var oField = this._createField(oConfig);
		this.addAggregation("_formContent",
			oField
		);
		//reset the cols to original
		oConfig.cols = oConfig.__cols;
		delete oConfig.__cols;
	};
	/**
	 * Returns the current language specific text for a given key or "" if no translation for the key exists
	 */
	CardEditor.prototype._getCurrentLanguageSpecificText = function (sKey) {
		var sLanguage = this._language;
		if (this._oTranslationBundle) {
			var sText = this._oTranslationBundle.getText(sKey, [], true);
			if (sText === undefined) {
				return "";
			}
			return sText;
		}
		if (!sLanguage) {
			return "";
		}
		var vI18n = this._oEditorCard.getManifestEntry("/sap.app/i18n");
		if (!vI18n) {
			return "";
		}
		if (typeof vI18n === "string") {
			var aFallbacks = [sLanguage];
			if (sLanguage.indexOf("_") > -1) {
				aFallbacks.push(sLanguage.substring(0, sLanguage.indexOf("_")));
			}
			// load the ResourceBundle relative to the manifest
			this._oTranslationBundle = ResourceBundle.create({
				url: this._getBaseUrl() + vI18n,
				async: false,
				locale: sLanguage,
				supportedLocales: aFallbacks,
				fallbackLocale: ""
			});

			return this._getCurrentLanguageSpecificText(sKey);
		}
	};

	CardEditor.prototype._getBaseUrl = function () {
		if (this._oEditorCard && this._oEditorCard.isReady()) {
			return this._oEditorCard.getBaseUrl() || this.oCardEditor._oEditorCard._oCardManifest.getUrl();
		}
		return "";
	};

	/**
	 * Starts the editor, creates the fields and preview
	 */
	CardEditor.prototype._startEditor = function () {
		var oSettings = this._settingsModel.getProperty("/");
		if (oSettings.form && oSettings.form.items) {
			if (this.getMode() === "translation") {
				//add 2 group items to show over the columns to avoid language repetition in the labels
				this._addItem({
					type: "group",
					cols: 1,
					translatable: true,
					label: oResourceBundle.getText("CARDEDITOR_ORIGINALLANG")
				});
				this._addItem({
					type: "group",
					cols: 1,
					translatable: true,
					label: CardEditor._languages[this._language] || this.getLanguage()
				});
			}
			this._mItemsByPaths = {};
			for (var n in oSettings.form.items) {
				var oItem = oSettings.form.items[n];
				if (oItem.manifestpath) {
					this._mItemsByPaths[oItem.manifestpath] = oItem;
				}
				if (oItem) {
					//force a label setting, set it to the name of the item
					oItem.label = oItem.label || n;
					//what is the current value from the change?
					var sCurrentLayerValue = this._currentLayerManifestChanges[oItem.manifestpath];
					//if not changed it should be undefined
					oItem._changed = sCurrentLayerValue !== undefined;

					//check if the provided value from the parameter or designtime default value is a translated value
					//restrict this to string types for now
					if (oItem.type === "string") {
						oItem._translatedDefaultPlaceholder = this._getManifestDefaultValue(oItem.manifestpath) || oItem.defaultValue;
						var sTranslationTextKey = null,
							sPlaceholder = oItem._translatedDefaultPlaceholder;
						if (sPlaceholder) {
							//parameter translated value wins over designtime defaultValue
							if (this._isValueWithHandlebarsTranslation(sPlaceholder)) {
								sTranslationTextKey = sPlaceholder.substring(2, sPlaceholder.length - 2);
							} else if (sPlaceholder.startsWith("{i18n>")) {
								sTranslationTextKey = sPlaceholder.substring(6, sPlaceholder.length - 1);
							}
							//only if there is a translation key
							if (sTranslationTextKey) {
								//force translatable, even if it was not explicitly set already
								oItem.translatable = true;
								oItem._translatedDefaultValue = this.getModel("i18n").getResourceBundle().getText(sTranslationTextKey);
								if (oItem._changed) {
									//item was changed, take the current value
									oItem.value = sCurrentLayerValue;
								} else {
									oItem.value = oItem._translatedDefaultValue;
								}
								if (this.getMode() === "translation") {
									//if we are in translation mode the default value differs and depends on the language
									//TODO this does not work in SWZ, the base path is not taken into account...
									//get the translated default value for the language we want to translate this.getLanguage()
									oItem._translatedDefaultValue = this._getCurrentLanguageSpecificText(sTranslationTextKey);
								}
							}
						}
						if (this.getMode() === "translation") {
							if (this._isValueWithHandlebarsTranslation(oItem.label)) {
								oItem._translatedLabel = this._getCurrentLanguageSpecificText(oItem.label.substring(2, oItem.label.length - 2), true);
							} else if (oItem.label && oItem.label.startsWith("{i18n>")) {
								//TODO this does not work in SWZ, the base path is not taken into account...
								//get the translated default value for the language we want to translate this.getLanguage()
								oItem._translatedLabel = this._getCurrentLanguageSpecificText(oItem.label.substring(6, oItem.label.length - 1), true);
							}
						}
					}

				}
			}
		}

		for (var n in oSettings.form.items) {
			var oItem = oSettings.form.items[n];
			this._addItem(oItem);
		}
		//add preview
		if (this.getMode() !== "translation") {
			this._initPreview().then(function () {
				Promise.all(this._aFieldReadyPromise).then(function () {
					this._ready = true;
					this.fireReady();
				}.bind(this));
			}.bind(this));
		} else {
			Promise.all(this._aFieldReadyPromise).then(function () {
				this._ready = true;
				this.fireReady();
			}.bind(this));
		}
	};
	/**
	 * Destroy the editor and the internal card instance that it created
	 */
	CardEditor.prototype.destroy = function () {
		if (this._oEditorCard) {
			this._oEditorCard.destroy();
		}
		if (this._oPopover) {
			this._oPopover.destroy();
		}
		if (this._oDesigntimeInstance) {
			this._oDesigntimeInstance.destroy();
		}
		this._manifestModel = null;
		this._originalManifestModel = null;
		this._settingsModel = null;
		Control.prototype.destroy.apply(this, arguments);
	};
	/**
	 * Initializes the preview
	 */
	CardEditor.prototype._initPreview = function () {
		return new Promise(function (resolve, reject) {
			sap.ui.require(["sap/ui/integration/designtime/editor/CardPreview"], function (Preview) {
				var oPreview = new Preview({
					settings: this._oDesigntimeInstance.getSettings(),
					card: this._oEditorCard
				});
				this.setAggregation("_preview", oPreview);
				resolve();
			}.bind(this));
		}.bind(this));
	};
	/**
	 * updates the preview
	 * TODO: Track changes and call update of the preview
	 */
	CardEditor.prototype._updatePreview = function () {
		var oPreview = this.getAggregation("_preview");
		if (oPreview) {
			oPreview.update();
		}
	};
	/**
	 * Applies the defaults for the designtime settings
	 */
	CardEditor.prototype._applyDesigntimeDefaults = function (oSettings) {
		oSettings = oSettings || {};
		oSettings.form = oSettings.form || {};
		oSettings.form.items = oSettings.form.items || {};
		oSettings.preview = oSettings.preview || {
			modes: "Abstract"
		};
		var mItems = oSettings.form.items || oSettings.form.items;
		for (var n in mItems) {
			var oItem = mItems[n];
			if (oItem.manifestpath) {
				oItem.value = this._manifestModel.getProperty(oItem.manifestpath);
			}
			if (oItem.visible === undefined || oItem.visible === null) {
				oItem.visible = true;
			}
			if (typeof oItem.translatable !== "boolean") {
				oItem.translatable = false;
			}
			if (oItem.editable === undefined || oItem.editable === null) {
				oItem.editable = true;
			}
			if (!oItem.label) {
				oItem.label = n;
			}

			if (!oItem.type || oItem.type === "enum") {

				oItem.type = "string";
			}
			//only if the value is undefined from the this._manifestModel.getProperty(oItem.manifestpath)
			//false, "", 0... are valid values and should not apply the default
			if (oItem.value === undefined || oItem.value === null) {
				switch (oItem.type) {
					case "boolean": oItem.value = oItem.defaultValue || false; break;
					case "integer":
					case "number": oItem.value = oItem.defaultValue || 0; break;
					case "string[]": oItem.value = oItem.defaultValue || []; break;
					default: oItem.value = oItem.defaultValue || "";
				}
			}
			if (oItem.type === "group") {
				if (oItem.visible === undefined || oItem.value === null) {
					oItem.visible = true;
				}
			}
			oItem._settingspath = "/form/items/" + n;
		}
	};
	/**
	 * Applies previous layer designtime settings that were changed
	 */
	CardEditor.prototype._applyDesigntimeLayers = function (oSettings) {
		//pull current values
		if (this._appliedLayerManifestChanges && Array.isArray(this._appliedLayerManifestChanges)) {
			for (var i = 0; i < this._appliedLayerManifestChanges.length; i++) {
				var oChanges = this._appliedLayerManifestChanges[i][":designtime"];
				if (oChanges) {
					var aKeys = Object.keys(oChanges);
					for (var j = 0; j < aKeys.length; j++) {
						this._settingsModel.setProperty(aKeys[j], oChanges[aKeys[j]]);
					}
				}
			}
		}
		if (this._currentLayerManifestChanges) {
			var oChanges = this._currentLayerManifestChanges[":designtime"];
			if (oChanges) {
				var aKeys = Object.keys(oChanges);
				for (var j = 0; j < aKeys.length; j++) {
					//apply the values to a "_next/editable", "_next/visible" entry to the settings.
					//the current layer needs to be able to change those values
					var sPath = aKeys[j],
						sNext = sPath.substring(0, sPath.lastIndexOf("/") + 1) + "_next";
					if (!this._settingsModel.getProperty(sNext)) {
						//create a _next entry if it does not exist
						this._settingsModel.setProperty(sNext, {});
					}
					var sNext = sPath.substring(0, sPath.lastIndexOf("/") + 1) + "_next",
						sProp = sPath.substring(sPath.lastIndexOf("/") + 1);
					this._settingsModel.setProperty(sNext + "/" + sProp, oChanges[aKeys[j]]);
				}
			}
		}
	};
	/**
	 * Creates a designtime instance based on an configuration section within the manifest.
	 * This is valid if there is no explicit sap.card/designtime module in the manifest itself.
	 */
	CardEditor.prototype._createParameterDesigntime = function (oConfiguration) {
		var oSettings = {},
			sBasePath = "/sap.card/configuration/parameters/",
			sMode = this.getMode();
		if (oConfiguration && oConfiguration.parameters) {
			oSettings.form = oSettings.form || {};
			oSettings.form.items = oSettings.form.items || {};
			var oItems = oSettings.form.items;
			Object.keys(oConfiguration.parameters).forEach(function (n) {
				oItems[n] = merge({
					manifestpath: sBasePath + n + "/value",
					editable: (sMode !== "translation"),
					_settingspath: "/form/items/" + n
				}, oConfiguration.parameters[n]);
				var oItem = oItems[n];
				if (!oItem.type) {
					oItem.type = "string";
				}
				if (!oItem.hasOwnProperty("visible")) {
					oItem.visible = true;
				}
			});
		}
		return new Designtime(oSettings);
	};
	/**
	 * Adds additional settings for destinations section in admin mode
	 * @param {} oConfiguration
	 */
	CardEditor.prototype._addDestinationSettings = function (oConfiguration) {
		var oSettings = this._oDesigntimeInstance.getSettings(),
			sBasePath = "/sap.card/configuration/destinations/";
		oSettings.form = oSettings.form || {};
		oSettings.form.items = oSettings.form.items || {};
		if (oSettings && oConfiguration && oConfiguration.destinations) {
			if (!oSettings.form.items["destination.group"]) {
				//destination section separated by a group header
				oSettings.form.items["destination.group"] = {
					label: oResourceBundle.getText("CARDEDITOR_DESTINATIONS") || "Destinations",
					type: "group",
					visible: true
				};
			}
			var oItems = oSettings.form.items;
			Object.keys(oConfiguration.destinations).forEach(function (n) {
				var _values = [{}], //empty entry
					oHost = this._oEditorCard.getHostInstance();
				oItems[n + ".destinaton"] = merge({
					manifestpath: sBasePath + n + "/name", //destination points to name not value
					visible: true,
					type: "destination",
					editable: true,
					allowDynamicValues: false,
					allowSettings: false,
					value: oConfiguration.destinations[n].name,
					defaultValue: oConfiguration.destinations[n].defaultUrl,
					_settingspath: "/form/items/" + [n + ".destinaton"],
					_values: _values,
					_destinationName: n
				}, oConfiguration.destinations[n]);
				if (typeof oItems[n + ".destinaton"].label === "undefined") {
					oItems[n + ".destinaton"].label = n;
				}
				if (oHost) {
					oItems[n + ".destinaton"]._loading = true;
					this._oEditorCard.getHostInstance().getDestinations().then(function (n, a) {
						oItems[n + ".destinaton"]._values = _values.concat(a);
						oItems[n + ".destinaton"]._loading = false;
						this._settingsModel.checkUpdate(true);
						oItems[n + ".destinaton"].value = oConfiguration.destinations[n].name;
					}.bind(this, n)); //pass in n as first parameter
				}
			}.bind(this));
		}
	};
	/**
	 * Returns the default value that was given by the developer for the given path
	 * @param {string} sPath
	 */
	CardEditor.prototype._getManifestDefaultValue = function (sPath) {
		return this._originalManifestModel.getProperty(sPath);
	};
	/**
	 * Returns whether the value is translatable via the handlbars translation syntax {{KEY}}
	 * For other than string values false is returned
	 * @param {any} vValue
	 */
	CardEditor.prototype._isValueWithHandlebarsTranslation = function (vValue) {
		if (typeof vValue === "string") {
			return !!vValue.match(REGEXP_TRANSLATABLE);
		}
		return false;
	};

	//create static context entries
	CardEditor._contextEntries =
	{
		empty: {
			label: oResourceBundle.getText("CARDEDITOR_CONTEXT_EMPTY_VAL"),
			type: "string",
			description: oResourceBundle.getText("CARDEDITOR_CONTEXT_EMPTY_DESC"),
			placeholder: "",
			value: ""
		},
		"card.internal": {
			label: oResourceBundle.getText("CARDEDITOR_CONTEXT_CARD_INTERNAL_VAL"),
			todayIso: {
				type: "string",
				label: oResourceBundle.getText("CARDEDITOR_CONTEXT_CARD_TODAY_VAL"),
				description: oResourceBundle.getText("CARDEDITOR_CONTEXT_CARD_TODAY_DESC"),
				tags: [],
				placeholder: oResourceBundle.getText("CARDEDITOR_CONTEXT_CARD_TODAY_VAL"),
				customize: ["format.dataTime"],
				value: "{{parameters.TODAY_ISO}}"
			},
			nowIso: {
				type: "string",
				label: oResourceBundle.getText("CARDEDITOR_CONTEXT_CARD_NOW_VAL"),
				description: oResourceBundle.getText("CARDEDITOR_CONTEXT_CARD_NOW_DESC"),
				tags: [],
				placeholder: oResourceBundle.getText("CARDEDITOR_CONTEXT_CARD_NOW_VAL"),
				customize: ["dateFormatters"],
				value: "{{parameters.NOW_ISO}}"
			},
			currentLanguage: {
				type: "string",
				label: oResourceBundle.getText("CARDEDITOR_CONTEXT_CARD_LANG_VAL"),
				description: oResourceBundle.getText("CARDEDITOR_CONTEXT_CARD_LANG_VAL"),
				tags: ["technical"],
				customize: ["languageFormatters"],
				placeholder: oResourceBundle.getText("CARDEDITOR_CONTEXT_CARD_LANG_VAL"),
				value: "{{parameters.LOCALE}}"
			}
		}
	};
	//map of language strings in their actual language representation, initialized in CardEditor.init
	CardEditor._languages = {};

	//theming from parameters to css valiables if css variables are not turned on
	//find out if css vars are turned on
	CardEditor._appendThemeVars = function () {
		var oOldElement = document.getElementById("sap-ui-integration-editor-style");
		if (oOldElement && oOldElement.parentNode) {
			oOldElement.parentNode.removeChild(oOldElement);
		}
		var aVars = [
			"sapUiButtonHoverBackground",
			"sapUiBaseBG",
			"sapUiContentLabelColor",
			"sapUiTileSeparatorColor",
			"sapUiHighlight",
			"sapUiListSelectionBackgroundColor",
			"sapUiChartScrollbarBorderColor"],
			oStyle = document.createElement("style");
		oStyle.setAttribute("id", "sap-ui-integration-editor-style");
		for (var i = 0; i < aVars.length; i++) {
			aVars[i] = "--" + aVars[i] + ":" + Parameters.get(aVars[i]);
		}
		oStyle.innerHTML = ".sapUiIntegrationCardEditor, .sapUiIntegrationFieldSettings, .sapUiIntegrationIconSelectList {" + aVars.join(";") + "}";
		document.body.appendChild(oStyle);
	};

	//initializes global settings
	CardEditor.init = function () {
		this.init = function () { }; //replace self

		//add theming variables if css vars are not turned on
		//if (!window.getComputedStyle(document.documentElement).getPropertyValue('--sapBackgroundColor')) {
		CardEditor._appendThemeVars();
		Core.attachThemeChanged(function () {
			CardEditor._appendThemeVars();
		});
		//}

		var sCssURL = sap.ui.require.toUrl("sap.ui.integration.designtime.editor.css.CardEditor".replace(/\./g, "/") + ".css");
		includeStylesheet(sCssURL);
		LoaderExtension.loadResource("sap/ui/integration/designtime/editor/languages.json", {
			dataType: "json",
			failOnError: false,
			async: true
		}).then(function (o) {
			CardEditor._languages = o;
		});
	};
	CardEditor.init();

	return CardEditor;
});