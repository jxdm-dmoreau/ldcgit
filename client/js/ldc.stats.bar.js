
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
            categories: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
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
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            x: -3,
            y: 10,
            formatter: function() {
                return this.y;
            },
            style: {
                font: 'normal 13px Verdana, sans-serif'
                    }
            }         
        }],
    });


}



