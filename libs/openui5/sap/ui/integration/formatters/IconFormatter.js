/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/core/IconPool"],function(B,I){"use strict";var a=B.extend("sap.ui.integration.util.Destinations",{constructor:function(d){B.call(this);this._oDestinations=d;}});a.prototype.formatSrc=function(u,A){var i=0;if(!u||!A){return u;}if(u.startsWith("data:")){return u;}if(this._oDestinations.hasDestination(u)){return this._oDestinations.processString(u);}if(I.isIconURI(u)||u.startsWith("http://")||u.startsWith("https://")||u.startsWith("//")){return u;}if(u.startsWith("..")){i=2;}else if(u.startsWith(".")){i=1;}return sap.ui.require.toUrl(A.replace(/\./g,"/")+u.slice(i,u.length));};return a;});
