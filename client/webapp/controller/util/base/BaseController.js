sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/ui/core/format/DateFormat",
        "sap/m/BusyIndicator"
], function(Controller, History, DateFormat, BusyIndicator) {
        "use strict";
        return Controller.extend("com.perezjquim.energysim.client.controller.util.BaseController", {
                setBusy: function(sBusy) {
                        if (sBusy) {
                                BusyIndicator.show(0);
                        } else {
                                BusyIndicator.hide();
                        }
                },
                getModel: function(sName) {
                        const oComponent = this.getOwnerComponent();
                        const oModel = oComponent.getModel(sName);
                        return oModel;
                },
                attachPatternMatched(sRoute, fFunction) {
                        const oComponent = this.getOwnerComponent();
                        const oRouter = oComponent.getRouter();
                        const oRoute = oRouter.getRoute(sRoute);
                        oRoute.attachPatternMatched(fFunction);
                },
                getConfig: function(sKey) {
                        const oConfigModel = this.getModel("config");
                        const oConfig = oConfigModel.getProperty(`/${sKey}`);
                        return oConfig;
                },
                navTo: function(sRoute, oParams, bReplace) {
                        const oComponent = this.getOwnerComponent();
                        const oRouter = oComponent.getRouter();
                        return oRouter.navTo(sRoute, oParams, bReplace);
                },
                getText: function(sKey) {
                        const oI18n = this.getModel("i18n");
                        const oBundle = oI18n.getResourceBundle();
                        const sText = oBundle.getText(sKey);
                        return sText;
                },
                navBack: function() {
                        const oHistory = History.getInstance();
                        const sPreviousHash = oHistory.getPreviousHash();

                        if (sPreviousHash) {
                                window.history.go(-1);
                        } else {
                                this.navTo("Home", true);
                        }
                },
                formatEventDatetime: function(sDatetime) {
                        if (sDatetime) {
                                const oDate = new Date(sDatetime);
                                const oDateFormatter = DateFormat.getDateTimeInstance();
                                return oDateFormatter.format(oDate);
                        } else {
                                return this.getText("event_pending_datetime");
                        }
                },
                formatPlugHref: function(iPlugId) {
                        const oModel = this.getModel("ws_data");
                        const oPlugs = oModel.getProperty("/plugs");
                        if (oPlugs && oPlugs.length > 0) {
                                const iIndex = oPlugs.findIndex(function(oPlug) {
                                        return oPlug.id == iPlugId;
                                });
                                if (iIndex > -1) {
                                        return `#/Plugs/${iIndex}`;
                                }
                        }
                },
                formatCarHref: function(iCarId) {
                        const oModel = this.getModel("ws_data");
                        const oCars = oModel.getProperty("/cars");
                        if (oCars && oCars.length > 0) {
                                const iIndex = oCars.findIndex(function(oCar) {
                                        return oCar.id == iCarId;
                                });
                                if (iIndex > -1) {
                                        return `#/Cars/${iIndex}`;
                                }
                        }
                }
        });
});