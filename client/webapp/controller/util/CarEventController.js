sap.ui.define([
        "./BaseController",
        "sap/ui/core/format/DateFormat"
        ], function(BaseController,DateFormat)
        {
                "use strict";
                return BaseController.extend("com.perezjquim.energysim.client.controller.util.CarEventController",
                {
                       formatEventDatetime: function(sDatetime)
                       {
                              if(sDatetime)
                              {
                                     const oDate = new Date(sDatetime);
                                     const oDateFormatter = DateFormat.getDateTimeInstance();
                                     return oDateFormatter.format(oDate);
                             }
                             else
                             {
                                     return this.getText("event_pending_datetime");
                             }
                     }
             });
        });