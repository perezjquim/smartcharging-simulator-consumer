sap.ui.define([
        "sap/ui/base/Object"
        ], function(Object)
        {
                "use strict";
                return Object.extend("com.perezjquim.energysim.client.controller.util.MessageHelper",
                {
                        _oController: null,
                        MESSAGE_TYPES:
                        {
                                LOG: 'log',
                                STATE: 'state',
                                DATA: 'data'
                        },
                        constructor: function(oController)
                        {
                                this._oController = oController;
                        },
                        parse: function(sMessage)
                        {
                                const oMessage = JSON.parse(sMessage);
                                const sMessageType = oMessage['message_type'];
                                const sMessageValue = oMessage['message_value'];
                                switch (sMessageType)
                                {
                                        case this.MESSAGE_TYPES.STATE:
                                        this._storeState(sMessageValue);
                                        break;

                                        case this.MESSAGE_TYPES.LOG:
                                        this._storeLog(sMessageValue);
                                        break;

                                        case this.MESSAGE_TYPES.DATA:
                                        this._storeData(sMessageValue);
                                        break;                                
                                }
                        },
                        _storeState: function(oData)
                        {
                                const oModel = this._oController.getModel("ws_state");       
                                oModel.setProperty("/is_sim_running", oData.is_sim_running);
                        },               
                        _storeLog: function(sMessageValue)
                        {
                                const oLogsModel = this._oController.getModel("ws_logs");
                                const sOldData = oLogsModel.getData();
                                var sNewData = sOldData;                                        
                                if(sOldData.length > 0)
                                {
                                        sNewData += `\n${sMessageValue}`;
                                }
                                else
                                {
                                        sNewData = sMessageValue;
                                }
                                oLogsModel.setData(sNewData);
                        },
                        _storeData: function(oData)
                        {
                                const oModel = this._oController.getModel("ws_data");       
                                oModel.setData(oData);
                        }
                });
        });