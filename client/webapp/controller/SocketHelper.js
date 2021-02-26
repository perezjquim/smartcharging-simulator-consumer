sap.ui.define(["./MessageHelper"], function(MessageHelper)
{
        return {
                _oSocket: null,
                init: function(oController)
                {
                        const sSocketUrl = oController.getConfig("WS_URL");
                        this._oSocket = new WebSocket(sSocketUrl);
                        this._oSocket.addEventListener('open', function(oEvent)
                        {
                                console.log("CONNECTED");
                                this._sendMessage('Hello Server!');
                        }.bind(this));
                        this._oSocket.addEventListener('message', function(oEvent)
                        {
                                const sReceivedMessage = oEvent.data;
                                console.log('Message from server ', sReceivedMessage);
                                MessageHelper.parse(oController, sReceivedMessage);
                        }.bind(this));
                },
                _sendMessage: function(sMessage)
                {
                        this._oSocket.send(sMessage);
                }
        };
})