sap.ui.define([], function () {
	"use strict";
	return {
		formatTime	: function(time) {                                                            
			var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern: "HH:mm:ss"});
			var TZOffsetMs = new Date(0).getTimezoneOffset()*60*1000;                             
			var timeStr = timeFormat.format(new Date(time.ms + TZOffsetMs));                      
			return timeStr;                                                                       
		}
	};
});