sap.ui.define([], function()
{
    return {
        _oLoading: null,
        drawChart: function(oTarget)
        {
            if(!this._oLoading)
            {
                this._oLoading = google.charts.load('current', { 'packages' : [ 'corechart' ] });
            }

            this._oLoading.then(function()
            {
                const oDomRef = oTarget.getDomRef();
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
        }    
    };
});