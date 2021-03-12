sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/core/HTML"
    ], function (Control, HTML) {
        "use strict";
        return Control.extend("com.perezjquim.energysim.client.controller.util.GoogleChart", {
            metadata : {
                properties : {
                    chartType : { type : "string" },
                    columns :  { type : "string[]" },
                    rows: { type : "string[]" },
                    options : { type : "object" },
                    data : { type : "any[]" }
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
                const oDataTable = new google.visualization.DataTable();
                oDataTable.addColumn('string', 'Topping');
                oDataTable.addColumn('number', 'Slices');
                oDataTable.addRows([
                    ['Mushrooms', 3],
                    ['Onions', 1],
                    ['Olives', 1],
                    ['Zucchini', 1],
                    ['Pepperoni', 2]
                    ]);

                const oChartOptions = {
                    'title': 'How Much Pizza I Ate Last Night',
                    'width': 400,
                    'height': 300
                };

                const oChart = new google.visualization.PieChart(oDomRef);
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