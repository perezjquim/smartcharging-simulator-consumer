sap.ui.define([
	"./Plugs.controller",
], function(PlugsController) {
	"use strict";
	return PlugsController.extend("com.perezjquim.energysim.client.controller.PlugsDetail", {
		onInit: function(oEvent) {
			this.attachPatternMatched("PlugsDetail", this._onObjectMatched.bind(this));
		},
		_onObjectMatched: function(oEvent) {
			console.log(oEvent);
		}
	});
});