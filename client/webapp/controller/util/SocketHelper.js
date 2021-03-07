sap.ui.define(["./MessageHelper", "sap/m/MessageToast"], function(MessageHelper, MessageToast)
{
        return {
                _oSocket: null,        
                init: function(oController)
                {
                        const oMessageHelper = new MessageHelper(oController);

                        const oWsStateModel = oController.getModel("ws_state");
                        const sSocketUrl = oController.getConfig("WS_URL");

                        this._oSocket = new WebSocket(sSocketUrl);

                        this._oSocket.addEventListener('open', function(oEvent)
                        {
                                this.sendMessage('init', 'Hello Server!');
                                oWsStateModel.setProperty("/is_connected", true);
                                MessageToast.show(oController.getText("ws_is_connected"));                                
                        }.bind(this));

                        this._oSocket.addEventListener('message', function(oEvent)
                        {
                                const sReceivedMessage = oEvent.data;
                                oMessageHelper.parse(sReceivedMessage);
                        }.bind(this));

                        this._oSocket.addEventListener('close', function(oEvent)
                        {
                                oWsStateModel.setProperty("/is_connected", false);          
                                MessageToast.show(oController.getText("ws_is_disconnected"));    
                        }.bind(this));          

                        this._oSocket.addEventListener('error', function(oEvent)
                        {
                                oWsStateModel.setProperty("/is_connected", false);
                                MessageToast.show(oController.getText("ws_is_disconnected"));                                   
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
});