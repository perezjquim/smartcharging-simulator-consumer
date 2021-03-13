sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/core/HTML"
    ], function (Control, HTML) {
        "use strict";
        return Control.extend("com.perezjquim.energysim.client.controller.util.GoogleChart", {
            metadata : {
                properties : {
                    chartType : { type : "string" },
                    chartData :  { type : "object" },
                    chartOptions : { type : "object" }
                },
                aggregations : {
                 control : { type : "sap.ui.core.HTML", multiple: false }
             }        
         },

         _oLoading: null,            

         init : function () {
            const oHTMLControl = new HTML({
                content: "<div/>",
                afterRendering: this._onChartInit.bind(this)
            });

            this.setAggregation("control", oHTMLControl);            
        },

        _onChartInit: function(oEvent) {
            const oSource = oEvent.getSource();

            if(!this._oLoading)
            {
                this._oLoading = google.charts.load('current', { 'packages' : [ 'corechart' ] });
            }

            this._oLoading.then(function()
            {
                const oDomRef = oSource.getDomRef();

                const oChartData = this.getChartData();
                const oColumns = oChartData.columns;
                const oRows = oChartData.rows;        

                const oDataTable = new google.visualization.DataTable();

                if(oColumns && oColumns.length > 0)
                {
                    oColumns.forEach(function(oColumn)
                    {
                        const sColumnType = oColumn[ 'column_type' ];
                        const sColumnLabel = oColumn[ 'column_label' ];
                        oDataTable.addColumn(sColumnType, sColumnLabel);
                    });
                }

                if(oRows && oRows.length > 0)
                {
                    oDataTable.addRows(oRows);
                }

                const oChartOptions = this.getChartOptions();

                const sChartType = this.getChartType();

                const oChart = new google.visualization[sChartType](oDomRef);
                oChart.draw(oDataTable, oChartOptions);
            }.bind(this));                        
        },

        renderer : function (oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.writeClasses();
            oRM.write(">")
            oRM.renderControl(oControl.getAggregation("control"));
            oRM.write("</div>");
        }        
    });
    });