sap.ui.define([
  "./Cars.controller",
], function(CarsController) {
  "use strict";
  return CarsController.extend("com.perezjquim.energysim.client.controller.CarsDetail", {
    onInit: function(oEvent) {
      this.attachPatternMatched("CarsDetail", this._onObjectMatched.bind(this));
    },
    _onObjectMatched: function(oEvent) {
      const oArguments = oEvent.getParameter("arguments");
      const iIndex = oArguments.index;
      const sPath = `/cars/${iIndex}`;
      const oView = this.getView();
      oView.bindElement({
        model: "sim_data",
        path: sPath
      });
    }
  });
});