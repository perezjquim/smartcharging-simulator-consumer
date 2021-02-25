sap.ui.define(["./BaseController"], function(BaseController)
{
        "use strict";
        return BaseController.extend("com.perezjquim.energysim.controller.Home",
        {
                _oSocket: null,
                onBeforeRendering: function(oEvent)
                {
                        this._initSocket();
                },
                _initSocket: function()
                {
                        const sSocketUrl = this.getConfig("WS_URL");
                        this._oSocket = new WebSocket(sSocketUrl);
                        this._oSocket.addEventListener('open', function(oEvent)
                        {
                                console.log("CONNECTED");
                                this._oSocket.send('Hello Server!');
                        }.bind(this));
                        this._oSocket.addEventListener('message', function(oEvent)
                        {
                                console.log('Message from server ', event.data);
                        }.bind(this));
                },
                _sendMessage: function(sMessage)
                {
                        this._oSocket.send(sMessage);
                }
        });
});