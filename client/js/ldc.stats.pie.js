ldc.stats.pie = function() {

    

    function pie(graph) {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: graph.id,
            },
            title: {text: graph.title},
            plotArea: {
                shadow: null,
                borderWidth: null,
                backgroundColor: null
            },
            tooltip: {
                formatter: function() {
                return '<b>'+ this.point.name +'</b>: '+ this.y +' €';
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                    }
                }
            },
                legend: {
                    layout: 'vertical',
                    style: {
                        left: 'auto',
                        bottom: 'auto',
                        right: '10px',
                        top: '100px'
                    }
                },
                series: 
                    [{
                    type: 'pie',
                    name: 'Browser share',
                    data:graph.data
                }]
            });
    }


    ldc.stats.pie.create = function(graph) {
            pie(graph);
            return graph;
    }




}
