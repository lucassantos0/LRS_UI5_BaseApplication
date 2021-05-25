/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";return{domRef:function(p){var $=jQuery.find(".mdcbaseinfoPanelListItem");var a=$.filter(function(P){return jQuery(P).control(0).getParent().getKey()===p.getId();});return a[0];},name:{singular:"p13nDialog.PANEL_ITEM_NAME",plural:"p13nDialog.PANEL_ITEM_NAME_PLURAL"},actions:{remove:function(){return{changeType:"hideItem"};},reveal:function(){return{changeType:"revealItem"};}},isVisible:function(p){return p.getVisible();}};});
