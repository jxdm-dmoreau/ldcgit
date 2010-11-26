
ldc.stats.bar = function var(graph) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: graph.id,
            defaultSeriesType: 'column',
            margin: [ 50, 50, 100, 80]
        },
        title: {
            text: graph.title
        },
        xAxis: {
            categories: graph.legend,
            labels: {
                rotation: -45,
                align: 'right',
                style: {
                    font: 'normal 13px Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: graph.ytitle
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Dépenses (€)',
            data: graph.data,
            dataLabels: {
                enabled: true,
                formatter: function() {
                    return this.y+"€";
                }
            }
        }],
    });


}



