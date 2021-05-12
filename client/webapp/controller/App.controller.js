sap.ui.define([
	"./util/base/BaseController",
	"./util/data/SocketHelper",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment"
], function(BaseController, SocketHelper, History, Fragment) {
	"use strict";
	return BaseController.extend("com.perezjquim.energysim.client.controller.App", {
		onInit: async function(oEvent) {
			SocketHelper.init(this);
		},
		onHomeButtonPress: function(oEvent) {
			const oBar = oEvent.getSource();
			const oToolPage = oBar.getParent();
			const oSideContent = oToolPage.getSideContent();
			const oNavigationList = oSideContent.getItem();
			const oNavigationItems = oNavigationList.getItems();
			const oHomeItem = oNavigationItems.find(function(oItem) {
				const sKey = oItem.getKey();
				return sKey == "Home";
			});
			oNavigationList.fireItemSelect({
				item: oHomeItem
			});
		},
		onMenuButtonPress: function(oEvent) {
			const oBar = oEvent.getSource();
			const oToolPage = oBar.getParent();
			const bIsExpanded = oToolPage.getSideExpanded();
			oToolPage.setSideExpanded(!bIsExpanded);
		},
		onNavigationItemSelect: function(oEvent) {
			const oSelectedItem = oEvent.getParameter("item");
			const sKey = oSelectedItem.getKey();
			this.navTo(sKey);
		},
		onNavButtonPress: function(oEvent) {
			this.navBack();
		},
		onProductSwitcherPress: function(oEvent) {
			const oSource = oEvent.getParameter("button");
			if (!this._oSimMenu) {
				const oView = this.getView();
				Fragment.load({
					name: "com.perezjquim.energysim.client.view.fragment.SimMenu",
					controller: this
				}).then(function(oMenu) {
					oView.addDependent(oMenu);
					oMenu.openBy(oSource);
					this._oSimMenu = oMenu;
					return oMenu;
				}.bind(this));
			} else {
				this._oSimMenu.openBy(oSource);
			}
		}
	});
});