sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History"
], function(Controller, History) {
        "use strict";
        return Controller.extend("com.perezjquim.energysim.client.controller.util.BaseController", {
                getModel: function(sName) {
                        const oComponent = this.getOwnerComponent();
                        const oModel = oComponent.getModel(sName);
                        return oModel;
                },
                attachPatternMatched(sRoute, fFunction) {
                        const oComponent = this.getOwnerComponent();
                        const oRouter = oComponent.getRouter();
                        const oRoute = oRouter.getRoute(sRoute);
                        oRoute.attachPatternMatched(fFunction);
                },
                getConfig: function(sKey) {
                        const oConfigModel = this.getModel("config");
                        const oConfig = oConfigModel.getProperty(`/${sKey}`);
                        return oConfig;
                },
                navTo: function(sRoute, oParams, bReplace) {
                        const oComponent = this.getOwnerComponent();
                        const oRouter = oComponent.getRouter();
                        return oRouter.navTo(sRoute, oParams, bReplace);
                },
                getText: function(sKey) {
                        const oI18n = this.getModel("i18n");
                        const oBundle = oI18n.getResourceBundle();
                        const sText = oBundle.getText(sKey);
                        return sText;
                },
                navBack: function() {
                        const oHistory = History.getInstance();
                        const sPreviousHash = oHistory.getPreviousHash();

                        if (sPreviousHash) {
                                window.history.go(-1);
                        } else {
                                this.navTo("Home", true);
                        }
                }
        });
});