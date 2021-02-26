sap.ui.define(["./BaseController", "./SocketHelper"], function(BaseController, SocketHelper)
{
        "use strict";
        return BaseController.extend("com.perezjquim.energysim.client.controller.Home",
        {
                onBeforeRendering: function(oEvent)
                {
                        SocketHelper.init(this);
                }
        });
});