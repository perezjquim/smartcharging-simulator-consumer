sap.ui.define([
	"./Plugs.controller",
], function(PlugsController) {
	"use strict";
	return PlugsController.extend("com.perezjquim.energysim.client.controller.PlugsDetail", {
		onInit: function(oEvent) {
			this.attachPatternMatched("PlugsDetail", this._onObjectMatched.bind(this));
		},
		_onObjectMatched: function(oEvent) {
			const oArguments = oEvent.getParameter("arguments");
			const iIndex = oArguments.index;
			const sPath = `/plugs/${iIndex}`;
			const oView = this.getView();
			oView.bindElement({
				model: "sim_data",
				path: sPath
			});
		}
	});
});