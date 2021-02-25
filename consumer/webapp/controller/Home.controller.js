sap.ui.define(["./BaseController", "./SocketHelper"], function(BaseController, SocketHelper)
{
        "use strict";
        return BaseController.extend("com.perezjquim.energysim.controller.Home",
        {
                onBeforeRendering: function(oEvent)
                {
                        SocketHelper.init(this);
                }
        });
});