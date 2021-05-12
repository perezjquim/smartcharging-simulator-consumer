sap.ui.define([
        "sap/ui/base/Object"
], function(Object) {
        "use strict";
        return Object.extend("com.perezjquim.energysim.client.controller.util.MessageHelper", {
                _oController: null,
                MESSAGE_TYPES: {
                        STATE: 'state',
                        DATA: 'data',
                        SIM_LIST: 'sim_list'
                },
                constructor: function(oController) {
                        this._oController = oController;
                },
                parse: function(sMessage) {
                        const oMessage = JSON.parse(sMessage);
                        const sMessageType = oMessage['message_type'];
                        const sMessageValue = oMessage['message_value'];
                        switch (sMessageType) {
                                case this.MESSAGE_TYPES.STATE:
                                        this._storeState(sMessageValue);
                                        break;
                                case this.MESSAGE_TYPES.DATA:
                                        this._storeData(sMessageValue);
                                        break;
                                case this.MESSAGE_TYPES.SIM_LIST:
                                        this._storeSimList(sMessageValue);
                                        break;
                        }
                },
                _storeState: function(oData) {
                        const oModel = this._oController.getModel("ws_state");

                        oModel.setProperty("/is_sim_running", oData.is_sim_running);

                        const sConfig = this._oController.stringifyJSON(oData.config);
                        oModel.setProperty("/config", sConfig);
                },
                _storeData: function(oData) {
                        const oModel = this._oController.getModel("ws_data");
                        oModel.setData(oData);
                },
                _storeSimList: function(oData) {
                        const oModel = this._oController.getModel("ws_sim_list");
                        oModel.setData(oData);
                }
        });
});