
ldc.stats.area = function (graph) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: graph.id
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
            title : {
                text: null
            }
        },
        series: [{
            type: 'area',
            data: graph.data
        }],
        legend: {
            enabled: false
        },
        tooltip: {
            formatter: function() {
                return '<b>'+ this.x +'</b><br/>'+
                this.y+' €';
            }
        },

        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, 'rgb(69, 114, 167)'],
                        [1, 'rgba(2,0,0,0)']
                    ]
                },
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        }


    });
}



