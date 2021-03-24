sap.ui.define([
  "./util/base/BaseController",
  "sap/ui/core/ValueState",
  "./util/car/CarStatuses"
], function(BaseController, ValueState, CarStatuses) {
  "use strict";
  return BaseController.extend("com.perezjquim.energysim.client.controller.Cars", {
    onItemPress: function(oEvent) {
      const oItem = oEvent.getSource();
      const oTable = oItem.getParent();
      const oItems = oTable.getItems();
      const iIndex = oItems.indexOf(oItem);
      this.navTo("CarsDetail", {
        index: iIndex
      });
    },
    formatBatteryLevelValue: function(iBatteryLevel) {
      const iPercentValue = ((iBatteryLevel / 10) * 100);
      return iPercentValue;
    },
    formatBatteryLevelText: function(iBatteryLevel) {
      const iPercentage = (iBatteryLevel / 10) * 100;
      return `${iPercentage}% (${iBatteryLevel} / 10)`;
    },
    formatBatteryLevelState: function(iBatteryLevel) {
      switch (true) {
        case iBatteryLevel < 3:
          return ValueState.Error;
        case iBatteryLevel < 10:
          return ValueState.None;
        case iBatteryLevel == 10:
          return ValueState.Success;
      }
    },
    formatCarStatus: function(sStatus) {
      switch (sStatus) {
        case CarStatuses.STATUS_CHARGING:
          return ValueState.Success;
        case CarStatuses.STATUS_TRAVELING:
          return ValueState.Warning;
        case CarStatuses.STATUS_WAITING_TO_CHARGE:
        case CarStatuses.STATUS_READY:
        default:
          return ValueState.None;
      }
    },
    formatCarStatusText: function(sStatus) {
      switch (sStatus) {
        case CarStatuses.STATUS_CHARGING:
          return this.getText("car_is_charging");
        case CarStatuses.STATUS_TRAVELING:
          return this.getText("car_is_traveling");
        case CarStatuses.STATUS_WAITING_TO_CHARGE:
          return this.getText("car_is_waiting_to_charge");
        case CarStatuses.STATUS_READY:
          return this.getText("car_is_ready");
        default:
          return "?";
      }
    },
    formatCarStatusIcon: function(sStatus) {
      switch (sStatus) {
        case CarStatuses.STATUS_CHARGING:
          return "sap-icon://connected";
        case CarStatuses.STATUS_TRAVELING:
          return "sap-icon://busy";
        case CarStatuses.STATUS_WAITING_TO_CHARGE:
        case CarStatuses.STATUS_READY:
        default:
          return "sap-icon://status-inactive";
      }
    }
  });
});