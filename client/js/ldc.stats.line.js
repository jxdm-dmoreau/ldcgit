
ldc.stats.line = function var(graph) {
    chart = new Highcharts.Chart({
        chart: {
            renderTo: graph.id,
            defaultSeriesType: 'line',
        },
        title: {
            text: graph.title,
            x: -20 //center
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
            title: {
                text: '€'
            },
            min:0,
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function() {
                return '<b>'+ this.series.name +'</b><br/>'+this.x +': '+ this.y +'€';
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -10,
            y: 100,
            borderWidth: 0
        },
series: graph.data
    });

}



