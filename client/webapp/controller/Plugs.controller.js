sap.ui.define([
	"./util/base/BaseController",
	"./util/data/SocketHelper"
], function(BaseController, SocketHelper) {
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
		},
		onTogglePlugStatus: function(oEvent) {
			const oSource = oEvent.getSource();
			const oContext = oSource.getBindingContext("ws_data");

			const iPlugId = oContext.getProperty("id");
			const sPlugStatus = oContext.getProperty("status");

			var sPlugNewStatus = '';
			switch (sPlugStatus) {
				case 'enabled':
					sPlugNewStatus = 'disabled';
					break;

				case 'disabled':
					sPlugNewStatus = 'enabled';
					break;
			}

			SocketHelper.sendMessage('command', {
				'command_name': 'SET-PLUG-STATE',
				'command_args': {
					'plug_id': iPlugId,
					'plug_new_status': sPlugNewStatus
				}
			});
		}
	});
});