sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/core/HTML"
], function(Control, HTML) {
    "use strict";
    return Control.extend("com.perezjquim.energysim.client.controller.util.GoogleChart", {
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
                chartOptions: {
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

        _oLoadingPromise: null,

        init: function() {
            const oHTMLControl = new HTML({
                content: "<div/>",
                afterRendering: this._onChartInit.bind(this)
            });

            this.setAggregation("control", oHTMLControl);
        },

        _onChartInit: function(oEvent) {
            const oSource = oEvent.getSource();

            if (!this._oLoadingPromise) {
                this._oLoadingPromise = google.charts.load('current', {
                    'packages': ['corechart']
                });
            }

            this._oLoadingPromise.then(function() {
                const oDomRef = oSource.getDomRef();

                const oDataTable = new google.visualization.DataTable();

                const oChartData = this.getChartData() || {};

                const oColumns = oChartData.columns;
                const oRows = oChartData.rows;

                const oDateColumns = [];
                if (oColumns && oColumns.length > 0) {
                    oColumns.forEach(function(oColumn, iIndex) {
                        const sColumnType = oColumn['type'];
                        const sColumnLabel = oColumn['label'];
                        oDataTable.addColumn(sColumnType, sColumnLabel);

                        if (sColumnType == 'date') {
                            oDateColumns.push(iIndex);
                        }
                    });
                }

                if (oRows && oRows.length > 0) {
                    if (oDateColumns.length > 0) {
                        oRows.forEach(function(oRow) {
                            oDateColumns.forEach(function(iDateColumnIndex) {
                                oRow[iDateColumnIndex] = new Date(oRow[iDateColumnIndex]);
                            });
                        });
                    }
                    oDataTable.addRows(oRows);
                }

                const oChartOptions = this.getChartOptions() || {};
                const sChartTitle = this.getChartTitle();
                oChartOptions['title'] = oChartOptions['title'] || sChartTitle;

                const sChartType = this.getChartType() || "PieChart";

                const oChart = new google.visualization[sChartType](oDomRef);
                oChart.draw(oDataTable, oChartOptions);
            }.bind(this));
        },

        renderer: function(oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.addClass("z_googlechart");
            oRM.writeClasses();
            oRM.write(">")
            oRM.renderControl(oControl.getAggregation("control"));
            oRM.write("</div>");
        }
    });
});