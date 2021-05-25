/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/security/encodeCSS"],function(e){"use strict";var T={apiVersion:2};T.render=function(r,c){var t=c.getTooltip_AsString();var C=c._getContentType();if(C){C=e(C);}var f=e("sapMFrameType"+c.getFrameType());r.openStart("div",c);r.class("sapMTileCnt");r.class(C);r.class(f);if(t.trim()){r.attr("title",t);}r.openEnd();this._renderContent(r,c);this._renderFooter(r,c);r.close("div");};T._renderContent=function(r,c){if(!c._bRenderContent){return;}var C=c.getContent();if(C){r.openStart("div",c.getId()+"-content");r.class("sapMTileCntContent");r.openEnd();if(!C.hasStyleClass("sapMTcInnerMarker")){C.addStyleClass("sapMTcInnerMarker");}r.renderControl(C);r.close("div");}};T._renderFooter=function(r,c){if(!c._bRenderFooter){return;}var C="sapMTileCntFooterTextColor"+c.getFooterColor();var t=c.getTooltip_AsString();var f=c._getFooterText(r,c);r.openStart("div",c.getId()+"-footer-text");r.class("sapMTileCntFtrTxt");r.class(e(C));if(t.trim()){r.attr("title",t);}r.openEnd();r.text(f);r.close("div");};return T;},true);
