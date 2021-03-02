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
                                this.sendMessage('init', 'Hello Server!');
                        }.bind(this));
                        this._oSocket.addEventListener('message', function(oEvent)
                        {
                                const sReceivedMessage = oEvent.data;
                                MessageHelper.parse(oController, sReceivedMessage);
                        }.bind(this));
                },
                sendMessage: function(sMessageType, sMessageValue)
                {
                        const oMessage = {
                                'message_type': sMessageType,
                                'message_value': sMessageValue
                        };
                        const sMessage = JSON.stringify(oMessage);
                        this._oSocket.send(sMessage);
                }
        };
})