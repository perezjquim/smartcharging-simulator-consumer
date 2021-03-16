sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/core/Control"], function(UIComponent, Control) {
        "use strict";
        return UIComponent.extend("com.perezjquim.energysim.client.Component", {
                metadata: {
                        manifest: "json"
                },
                init: function() {
                        UIComponent.prototype.init.apply(this, arguments);
                        Control.busyIndicatorDelay = 0;
                        const oRouter = this.getRouter();
                        oRouter.initialize();
                }
        });
});