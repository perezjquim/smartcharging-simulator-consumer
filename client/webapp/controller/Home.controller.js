sap.ui.define(["./BaseController", "./SocketHelper"], function(BaseController, SocketHelper)
{
        "use strict";
        return BaseController.extend("com.perezjquim.energysim.client.controller.Home",
        {
                onBeforeRendering: function(oEvent)
                {
                        SocketHelper.init(this);
                },
                onPressStart: function(oEvent)
                {
                	SocketHelper.sendMessage("COMMAND$START-SIMULATION");		
                },
                onPressStop: function(oEvent)
                {
                	SocketHelper.sendMessage("COMMAND$STOP-SIMULATION");
                }
        });
});