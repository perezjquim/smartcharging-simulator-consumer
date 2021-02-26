sap.ui.define([], function()
{
        return {
                parse: function(oController, sMessage)
                {
                        switch (true)
                        {
                                case true:
                                        this._storeLog(oController, sMessage);
                                        break;
                        }
                },
                _storeLog: function(oController, sMessage)
                {
                        const oSocketModel = oController.getModel("ws_data");
                        const sOldData = oSocketModel.getProperty("/logs");
                        const sNewData = (sOldData || "") + `${sMessage}\n`;
                        oSocketModel.setProperty("/logs", sNewData);
                }
        };
})