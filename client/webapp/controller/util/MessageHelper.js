sap.ui.define(["sap/ui/base/Object"], function(Object)
{
        return Object.extend("com.perezjquim.energysim.client.controller.util.MessageHelper",
        {
                _oController: null,
                MESSAGE_TYPES:
                {
                        LOG: 'log',
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
                                case this.MESSAGE_TYPES.LOG:
                                this._storeLog(sMessageValue);
                                break;

                                case this.MESSAGE_TYPES.DATA:
                                this._storeData(sMessageValue);
                                break;                                
                        }
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
                _storeData: function(sMessageValue)
                {
                        const oData = JSON.parse(sMessageValue);
                        const oModel = this._oController.getModel("ws_data");       
                        oModel.setData(oData);
                }
        });
});