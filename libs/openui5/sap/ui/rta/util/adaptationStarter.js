/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/rta/RuntimeAuthoring","sap/ui/core/Element","sap/ui/fl/Utils","sap/ui/fl/Layer","sap/ui/fl/write/api/FeaturesAPI","sap/ui/core/UIComponent","sap/base/Log"],function(R,E,F,L,a,U,b){"use strict";function c(l){if(L.CUSTOMER===l){return a.isKeyUser().then(function(i){if(!i){throw new Error("Key user rights have not been granted to the current user");}});}return Promise.resolve();}function d(o,l,e,f,g){if(!(o.rootControl instanceof E)&&!(o.rootControl instanceof U)){return Promise.reject(new Error("An invalid root control was passed"));}var r;return c(o.flexSettings.layer).then(function(){o.rootControl=F.getAppComponentForControl(o.rootControl);r=new R(o);if(e){r.attachEvent("start",e);}if(f){r.attachEvent("failed",f);}var O=g||function(){r.destroy();};r.attachEvent("stop",O);if(l){return l(r);}}).then(function(){return r.start();}).then(function(){return r;}).catch(function(h){b.error("UI Adaptation could not be started",h.message);throw h;});}return d;});
