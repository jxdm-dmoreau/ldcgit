
ldc.stats.area = function (graph) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: graph.id
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        series: [{
            type: 'area',
            data: graph.data,
            name: 'Temperature'
        }]
    });
}



