sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller)
{
        "use strict";
        return Controller.extend("com.perezjquim.energysim.controller.BaseController",
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
                }
        });
});