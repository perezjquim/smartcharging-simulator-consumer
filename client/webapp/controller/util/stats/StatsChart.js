sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/core/HTML"
], function(Control, HTML) {
    "use strict";
    return Control.extend("com.perezjquim.energysim.client.controller.util.StatsChart", {
        metadata: {
            properties: {
                chartTitle: {
                    type: "string"
                },
                chartType: {
                    type: "string"
                },
                chartData: {
                    type: "object"
                },
                chartScales: {
                    type: "object"
                }
            },
            aggregations: {
                control: {
                    type: "sap.ui.core.HTML",
                    multiple: false
                }
            }
        },

        _oChart: null,
        _oChartConfig: null,

        init: function() {
            const oHTMLControl = new HTML({
                content: "<canvas/>",
                afterRendering: this._onChartInit.bind(this)
            });

            this.setAggregation("control", oHTMLControl);
        },

        _onChartInit: function(oEvent) {

            const sChartType = this.getChartType();

            if (sChartType) {

                const oChartData = this.getChartData() || {};

                const oDatasets = oChartData.datasets || [];

                const oLabels = oChartData.labels || [];
                oLabels.forEach(function(oLabel, iIndex) {
                    if (Date.parse(oLabel)) {
                        oLabels[iIndex] = new Date(oLabel);
                    }
                });

                const sChartTitle = this.getChartTitle();

                const oChartScales = this.getChartScales() || {};

                const oChartOptions = {
                    animation: {
                        duration: 0
                    },
                    hover: {
                        animationDuration: 0
                    },
                    elements: {
                        line: {
                            tension: 0
                        }
                    },
                    responsiveAnimationDuration: 0,
                    title: {
                        text: sChartTitle
                    },
                    scales: oChartScales
                };

                if (!this._oChartConfig) {
                    this._oChartConfig = {};
                }

                this._oChartConfig.type = sChartType;
                this._oChartConfig.data = {
                    labels: oLabels,
                    datasets: oDatasets,
                };
                this._oChartConfig.options = oChartOptions;

                if (!this._oChart) {

                    const oSource = oEvent.getSource();

                    const oCanvas = oSource.getDomRef();
                    const oCanvasContext = oCanvas.getContext("2d");

                    this._oChart = new Chart(oCanvasContext, this._oChartConfig);

                } else {

                    this._oChart.update();

                }

            } else {
                console.warn("EnergySim Chart -- chart type not given");
            }

        },

        renderer: function(oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.writeClasses();
            oRM.write(">")
            oRM.renderControl(oControl.getAggregation("control"));
            oRM.write("</div>");
        }
    });
});