sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/core/HTML"
], function(Control, HTML) {
    "use strict";
    return Control.extend("com.perezjquim.energysim.client.controller.util.StatsChart", {
        metadata: {
            properties: {
                width: {
                    type: "sap.ui.core.CSSSize",
                    defaultValue: "100%"
                },
                height: {
                    type: "sap.ui.core.CSSSize",
                    defaultValue: "auto"
                },
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
                canvas: {
                    type: "sap.ui.core.HTML",
                    multiple: false
                }
            }
        },

        _oChart: null,
        _oChartConfig: null,

        init: function() {
            const oCanvas = new HTML({
                content: "<canvas style=\'width:100% ; height:100%\'/>",
                afterRendering: this._onChartInit.bind(this)
            });

            this.setAggregation("canvas", oCanvas);
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
                    maintainAspectRatio: false,
                    responsiveAnimationDuration: 0,
                    title: {
                        display: true,
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
            const sWidth = oControl.getWidth();
            const sHeight = oControl.getHeight();

            oRM.write("<div");
            oRM.write(` style="width: ${sWidth} ; height: ${sHeight}"`);
            oRM.writeControlData(oControl);
            oRM.writeClasses();
            oRM.write(">")

            const oCanvas = oControl.getAggregation("canvas");
            oRM.renderControl(oCanvas);

            oRM.write("</div>");
        }
    });
});