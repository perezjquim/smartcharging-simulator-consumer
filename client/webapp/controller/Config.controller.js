sap.ui.define([
	"./util/base/BaseController",
	"./util/data/SocketHelper"
], function(BaseController, SocketHelper) {
	"use strict";
	return BaseController.extend("com.perezjquim.energysim.client.controller.Config", {
		onConfigSave: function(oEvent) {
			this.setBusy(true);

			const oModel = this.getModel("ws_state");
			const oConfig = JSON.parse(oModel.getProperty("/config"));
			SocketHelper.sendMessage('command', {
				'command_name': 'SET-CONFIG',
				'command_args': {
					'new_config': oConfig
				}
			});

			this.setBusy(false);
		}
	});
});