sap.ui.define([
	"./util/base/BaseController"
], function(BaseController) {
	"use strict";
	return BaseController.extend("com.perezjquim.energysim.client.controller.Plugs", {
		onItemPress: function(oEvent) {
			const oSource = oEvent.getSource();
			const oContext = oSource.getBindingContext("ws_data");
			const sId = oContext.getProperty("id");
			this.navTo("PlugsDetail", {
				id: sId
			});
		}
	});
});