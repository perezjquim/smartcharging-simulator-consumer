sap.ui.define([
	"./util/base/BaseController"
], function(BaseController) {
	"use strict";
	return BaseController.extend("com.perezjquim.energysim.client.controller.Logs", {
		formatLogs: function(oLogs) {
			if (oLogs && oLogs.length > 0) {
				const sLogs = oLogs
					.map(l => l.message)
					.join("\n");
				return sLogs;
			} else {
				return "";
			}
		}
	});
});