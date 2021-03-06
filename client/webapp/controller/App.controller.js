sap.ui.define(["./BaseController"], function(BaseController)
{
	"use strict";
	return BaseController.extend("com.perezjquim.energysim.client.controller.App",
	{
		onHomeButtonPress: function(oEvent)
		{
			const oBar = oEvent.getSource();			
			const oToolPage = oBar.getParent();
			const oSideContent = oToolPage.getSideContent();
			const oNavigationList = oSideContent.getItem();
			const oNavigationItems = oNavigationList.getItems();
			const oHomeItem = oNavigationItems.find(function(oItem)
			{
				const sKey = oItem.getKey();
				return sKey == "Home";
			});
			oNavigationList.fireItemSelect({ item: oHomeItem });
		},
		onMenuButtonPress : function(oEvent) 
		{
			const oBar = oEvent.getSource();			
			const oToolPage = oBar.getParent();
			const bIsExpanded = oToolPage.getSideExpanded();
			oToolPage.setSideExpanded(!bIsExpanded);
		},
		onNavigationItemSelect: function(oEvent)
		{
			const oSelectedItem = oEvent.getParameter("item");
			const sKey = oSelectedItem.getKey();
			this.navTo(sKey);
		}
	});
});