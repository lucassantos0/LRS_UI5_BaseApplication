/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var A={applyChanges:function(m,a,s){var u=Object.assign({},m);return s.registry().then(function(R){a.forEach(function(c){try{var C=R[c.getChangeType()];u=C.applyChange(u,c);if(!C.skipPostprocessing&&c.getTexts()){u=s.processTexts(u,c.getTexts());}}catch(e){s.handleError(e);}});return u;});}};return A;},true);
