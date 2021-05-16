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
		},
		onSelectSim: function(oEvent) {
			this.setBusy(true);

			const oList = oEvent.getSource();
			const oListItems = oList.getItems();
			const iNumberOfListItems = oListItems.length;

			const oListItem = oEvent.getParameter("listItem");
			const oContext = oListItem.getBindingContext("sim_list");
			const iListItemIdx = oList.indexOfItem(oListItem) + 1;
			const iSimulationId = oContext.getProperty("id");

			const oMiscModel = this.getModel("misc");
			const bIsWsSuspended = (iListItemIdx < iNumberOfListItems)
			oMiscModel.setProperty("/ws_suspended", bIsWsSuspended);

			const sSuccessText = this.getText("sim_select_succ");
			const sErrorText = this.getText("sim_select_err");

			if (bIsWsSuspended) {
				const oConfigModel = this.getModel("config");
				const sApiUrl = oConfigModel.getProperty("/API_URL");
				const sEndpointUrl = `${sApiUrl}/get_sim_data_by_id/${iSimulationId}`;

				const oModel = this.getModel("sim_data");
				oModel.loadData(sEndpointUrl).then(function() {
					this.toast(sSuccessText);
				}.bind(this)).catch(function() {
					this.toast(sErrorText);
				}.bind(this)).finally(function() {
					this.onAfterSelectSim(oList);
				}.bind(this));
			} else {
				SocketHelper.reconnect().then(function() {
					this.toast(sSuccessText);
				}.bind(this)).catch(function() {
					this.toast(sErrorText);
				}.bind(this)).finally(function() {
					this.onAfterSelectSim(oList);
				}.bind(this));
			}
		},
		onAfterSelectSim: function(oList) {
			oList.removeSelections(true);
			this._oSimMenu.close();
			this.setBusy(false);
		}
	});
});