sap.ui.define(["sap/ui/core/UIComponent"], function(UIComponent) {
        "use strict";
        return UIComponent.extend("com.perezjquim.energysim.client.Component", {
                metadata: {
                        manifest: "json"
                },
                init: function() {
                        UIComponent.prototype.init.apply(this, arguments);
                        const oRouter = this.getRouter();
                        oRouter.initialize();
                }
        });
});