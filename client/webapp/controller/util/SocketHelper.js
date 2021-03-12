sap.ui.define([
        "sap/ui/core/ws/WebSocket",
        "./MessageHelper", 
        "sap/m/MessageToast"
        ], function(WebSocket, MessageHelper, MessageToast)
        {
                "use strict";
                return {
                        _oMessageHelper: null,
                        _oSocket: null,        
                        _oController: null,
                        init: function(oController)
                        {
                                this._oController = oController;                        
                                this._oMessageHelper = new MessageHelper(this._oController);

                                this.connect();                                
                        },
                        connect: function()
                        {
                                const oWsStateModel = this._oController.getModel("ws_state");
                                const sSocketUrl = this._oController.getConfig("WS_URL");

                                this._oSocket = new WebSocket(sSocketUrl);

                                this._oSocket.attachOpen(function(oEvent)
                                {
                                        this.sendMessage('init', 'Hello Server!');
                                        oWsStateModel.setProperty("/is_connected", true);
                                        MessageToast.show(this._oController.getText("ws_is_connected"));                                
                                }.bind(this));

                                this._oSocket.attachMessage(function(oEvent)
                                {
                                        const sReceivedMessage = oEvent.getParameter("data");
                                        this._oMessageHelper.parse(sReceivedMessage);
                                }.bind(this));

                                this._oSocket.attachClose(function(oEvent)
                                {
                                        oWsStateModel.setProperty("/is_connected", false);          
                                        MessageToast.show(this._oController.getText("ws_is_disconnected"));    
                                }.bind(this));          

                                this._oSocket.attachError(function(oEvent)
                                {
                                        oWsStateModel.setProperty("/is_connected", false);
                                        MessageToast.show(this._oController.getText("ws_is_disconnected"));                                   
                                }.bind(this));                                   
                        },
                        reconnect: function()
                        {
                                this.connect();
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