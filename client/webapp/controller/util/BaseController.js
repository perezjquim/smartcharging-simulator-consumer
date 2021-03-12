sap.ui.define([
        "sap/ui/core/mvc/Controller"
        ], function(Controller)
        {
                "use strict";
                return Controller.extend("com.perezjquim.energysim.client.controller.util.BaseController",
                {
                        getModel: function(sName)
                        {
                                const oComponent = this.getOwnerComponent();
                                const oModel = oComponent.getModel(sName);
                                return oModel; 
                        },
                        getConfig: function(sKey)
                        {
                                const oConfigModel = this.getModel("config");
                                const oConfig = oConfigModel.getProperty(`/${sKey}`);
                                return oConfig;
                        },
                        navTo: function(sRoute, oParams, bReplace)
                        {
                                const oComponent = this.getOwnerComponent();
                                const oRouter = oComponent.getRouter();
                                return oRouter.navTo(sRoute, oParams, bReplace);
                        },
                        getText: function(sKey)
                        {
                                const oI18n = this.getModel("i18n");
                                const oBundle = oI18n.getResourceBundle();
                                const sText = oBundle.getText(sKey);
                                return sText;
                        }
                });
        });