sap.ui.define([
    "./util/base/BaseController",
    "./util/data/SocketHelper",
    "sap/ui/core/ValueState"
], function(BaseController, SocketHelper, ValueState) {
    "use strict";
    return BaseController.extend("com.perezjquim.energysim.client.controller.Home", {
        onPressReconnect: async function(oEvent) {
            this.setBusy(true);

            await SocketHelper.reconnect();

            this.setBusy(false);
        },
        onPressStart: function(oEvent) {
            this.setBusy(true);

            SocketHelper.sendMessage('command', {
                'command_name': 'START-SIMULATION',
                'command_args': {}
            });

            this.setBusy(false);
        },
        onPressStop: function(oEvent) {
            this.setBusy(true);

            SocketHelper.sendMessage('command', {
                'command_name': 'STOP-SIMULATION',
                'command_args': {}
            });

            this.setBusy(false);
        },
        formatWsStatusIcon: function(bIsConnected) {
            if (bIsConnected) {
                return "sap-icon://connected";
            } else {
                return "sap-icon://disconnected";
            }
        },
        formatWsStatusText: function(bIsConnected) {
            if (bIsConnected) {
                return this.getText("ws_is_connected");
            } else {
                return this.getText("ws_is_disconnected");
            }
        },
        formatWsStatus: function(bIsConnected) {
            if (bIsConnected) {
                return ValueState.Success;
            } else {
                return ValueState.Error;
            }
        },
        formatSimStatusIcon: function(bIsRunning) {
            if (bIsRunning) {
                return "sap-icon://busy";
            } else {
                return "sap-icon://status-inactive";
            }
        },
        formatSimStatusText: function(bIsRunning) {
            if (bIsRunning) {
                return this.getText("sim_is_running");
            } else {
                return this.getText("sim_is_inactive");
            }
        },
        formatSimStatus: function(bIsRunning) {
            if (bIsRunning) {
                return ValueState.Success;
            } else {
                return ValueState.None;
            }
        }
    });
});