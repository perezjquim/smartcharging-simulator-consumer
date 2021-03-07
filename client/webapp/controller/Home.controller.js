sap.ui.define(["./util/BaseController", "./util/SocketHelper", "sap/ui/core/ValueState"], function(BaseController, SocketHelper, ValueState)
{
        "use strict";
        return BaseController.extend("com.perezjquim.energysim.client.controller.Home",
        {
                onPressStart: function(oEvent)
                {
                        SocketHelper.sendMessage('command', 'START-SIMULATION');
                },
                onPressStop: function(oEvent)
                {
                        SocketHelper.sendMessage('command', 'STOP-SIMULATION');
                },
                formatWsStatusIcon: function(bIsConnected)
                {
                        if(bIsConnected)
                        {
                                return "sap-icon://connected";
                        }
                        else
                        {
                                return "sap-icon://disconnected";
                        }
                },
                formatWsStatusText: function(bIsConnected)
                {
                        if(bIsConnected)
                        {
                                return this.getText("ws_is_connected");
                        }
                        else
                        {
                                return this.getText("ws_is_disconnected");
                        }
                },
                formatWsStatus: function(bIsConnected)
                {
                        if(bIsConnected)
                        {
                                return ValueState.Success;
                        }
                        else
                        {
                                return ValueState.Error;
                        }
                },
                formatSimStatusIcon: function(bIsRunning)
                {
                        if(bIsRunning)
                        {
                                return "sap-icon://busy";
                        }
                        else
                        {
                                return "sap-icon://status-inactive";
                        }
                },
                formatSimStatusText: function(bIsRunning)
                {
                        if(bIsRunning)
                        {
                                return this.getText("sim_is_running");
                        }
                        else
                        {
                                return this.getText("sim_is_inactive");
                        }
                },
                formatSimStatus: function(bIsRunning)
                {
                        if(bIsRunning)
                        {
                                return ValueState.Success;
                        }
                        else
                        {
                                return ValueState.None;
                        }
                }                                                
        });
});