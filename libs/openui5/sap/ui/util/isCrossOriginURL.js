/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/URI'],function(U){"use strict";function i(h){var u=new U(h),u=u.is("relative")?u.absoluteTo(document.baseURI):u,o=window.location.origin||new U().origin();return u.origin()!==o;}return i;});
