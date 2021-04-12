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
			oEvent.preventDefault();

			const oSource = oEvent.getSource();
			oSource.setBusy(true);

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
				'command_name': 'SET-PLUG-STATUS',
				'command_args': {
					'plug_id': iPlugId,
					'plug_new_status': sPlugNewStatus
				}
			});

			oSource.setBusy(false);
		}
	});
});