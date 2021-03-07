sap.ui.define(["./util/BaseController", "./util/SocketHelper"], function(BaseController, SocketHelper)
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
                }
        });
});