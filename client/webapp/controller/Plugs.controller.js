sap.ui.define([
	"./util/base/BaseController"
], function(BaseController) {
	"use strict";
	return BaseController.extend("com.perezjquim.energysim.client.controller.Plugs", {
		onItemPress: function(oEvent) {
			const oItem = oEvent.getSource();
			const oTable = oItem.getParent();
			const oItems = oTable.getItems();
			const iIndex = oItems.indexOf(oItem);
			this.navTo("PlugsDetail", {
				index: iIndex
			});
		}
	});
});