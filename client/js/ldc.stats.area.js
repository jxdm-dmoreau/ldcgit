
ldc.stats.area = function (graph) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: graph.id
        },
        title: {
            text: null
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title : {
                text: "Capital (€)"
            }
        },
        series: [{
            type: 'area',
            data: graph.data
        }],
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, 'rgb(69, 114, 167)'],
                        [1, 'rgba(2,0,0,0)']
                    ]
                }
            }
        }


    });
}



