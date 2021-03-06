sap.ui.define([], function()
{
        return {
                MESSAGE_TYPES:
                {
                        Log: 'log'
                },
                parse: function(oController, sMessage)
                {
                        const oMessage = JSON.parse(sMessage);
                        const sMessageType = oMessage['message_type'];
                        const sMessageValue = oMessage['message_value'];
                        switch (sMessageType)
                        {
                                case this.MESSAGE_TYPES.Log:
                                this._storeLog(oController, sMessageValue);
                                break;
                        }
                },
                _storeLog: function(oController, sMessageValue)
                {
                        const oLogsModel = oController.getModel("ws_logs");
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
                }
        };
})