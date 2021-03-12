sap.ui.define([
        "./util/BaseController",
        "sap/ui/core/ValueState"
        ], function(BaseController,ValueState)
        {
                "use strict";
                return BaseController.extend("com.perezjquim.energysim.client.controller.Cars",
                {
                        formatBatteryLevelText: function(iBatteryLevel)
                        {
                                const iPercentage = ( iBatteryLevel / 10 ) * 100;
                                return `${iPercentage}% (${iBatteryLevel} / 10)`;
                        },                
                        formatBatteryLevelState: function(iBatteryLevel)
                        {
                              switch(true)
                              {
                                     case iBatteryLevel < 3:
                                     return ValueState.Error;
                                     case iBatteryLevel < 10:
                                     return ValueState.None;
                                     case iBatteryLevel == 10:
                                     return ValueState.Success;
                             }
                     },                
                     formatCarStatus: function(bIsCharging, bIsTraveling)
                     {
                      switch(true)
                      {
                             case bIsCharging:
                             return ValueState.Success;
                             case bIsTraveling:
                             return ValueState.Warning;
                             default:
                             return ValueState.None;
                     }
             },
             formatCarStatusText: function(bIsCharging, bIsTraveling)
             {
              switch(true)
              {
                     case bIsCharging:
                     return this.getText("car_is_charging");
                     case bIsTraveling:
                     return this.getText("car_is_traveling");
                     default:
                     return this.getText("car_is_ready_to_travel");
             }
     },
     formatCarStatusIcon: function(bIsCharging, bIsTraveling)
     {
      switch(true)
      {
             case bIsCharging:
             return "sap-icon://connected";
             case bIsTraveling:
             return "sap-icon://busy";
             default:
             return "sap-icon://status-inactive";
     }
}
});
        });