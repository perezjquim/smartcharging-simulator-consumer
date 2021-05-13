sap.ui.define([
	"./util/base/BaseController",
	"./util/data/SocketHelper"
], function(BaseController, SocketHelper) {
	"use strict";
	return BaseController.extend("com.perezjquim.energysim.client.controller.Config", {
		onConfigSave: function(oEvent) {
			this.setBusy(true);

			const oModel = this.getModel("sim_state");
			const oConfig = JSON.parse(oModel.getProperty("/config"));
			SocketHelper.sendMessage('command', {
				'command_name': 'SET-CONFIG',
				'command_args': {
					'new_config': oConfig
				}
			});

			const sText = this.getText("config_save_toast_msg");
			this.toast(sText);

			this.setBusy(false);
		}
	});
});