/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BaseContentRenderer"],function(B){"use strict";var T=B.extend("sap.ui.integration.cards.TableContentRenderer");T.getMinHeight=function(c,C){if(!c){return this.DEFAULT_MIN_HEIGHT;}var i=this.isCompact(C),a=parseInt(c.maxItems)||0,r=i?2:2.75,t=i?2:2.75;return(a*r+t)+"rem";};return T;});
