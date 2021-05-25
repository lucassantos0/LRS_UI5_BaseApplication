/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Renderer","sap/m/StandardListItemRenderer"],function(R,S){"use strict";var L=R.extend(S);L.apiVersion=2;L.renderLIAttributes=function(r,l){S.renderLIAttributes.apply(this,arguments);r.class("sapUiIntegrationLCI");r.class("sapUiIntegrationLCIIconSize"+l.getIconSize());if(l.getMicrochart()){r.class("sapUiIntegrationLCIWithChart");}};L.renderLIContent=function(r,l){var i=l.getInfo(),t=l.getTitle(),d=l.getDescription(),a=l.getAdaptTitleSize(),s=!t&&i;if(l.getIcon()||l.getIconInitials()){r.renderControl(l._getAvatar());}r.openStart("div").class("sapMSLIDiv");if((!d&&a&&i)||s){r.class("sapMSLIInfoMiddle");}r.openEnd();this.renderTitleWrapper(r,l);if(t&&d){this.renderDescription(r,l);}if(s&&!l.getWrapping()){this.renderInfo(r,l);}if(l.getMicrochart()){r.renderControl(l.getMicrochart());}r.close("div");};return L;},true);
