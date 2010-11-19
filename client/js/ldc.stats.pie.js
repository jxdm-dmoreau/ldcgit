ldc.stats.pie = function() {

    
    var default_graph = {
        id: "default-stats",
        cx: 320,
        cy: 240,
        size: 100,
        title: "default title",
        data: [1, 2, 3, 4, 5],
        legend: ["1", "2", "3", "4", "5"]
    }


    function pie(graph) {
        var empty = {}
        graph = $.extend(empty, default_graph, graph);
        if (graph.r == undefined) {
            graph.r = Raphael(graph.id);
        } else {
            graph.r.clear();
        }
        DEBUG(graph);
        graph.r.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
        graph.r.g.text(graph.cx, graph.cy-150, graph.title).attr({"font-size": 20});
        var pie = graph.r.g.piechart(graph.cx, graph.cy, graph.size, graph.data, {legend: graph.legend, legendpos: "west"});
        pie.hover(
            function () {
                this.sector.stop();
                this.sector.scale(1.1, 1.1, this.cx, this.cy);
                if (this.label) {
                    this.label[0].stop();
                    this.label[0].scale(1.5);
                    this.label[1].attr({"font-weight": 800});
                }
            }, function () {
                this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
                if (this.label) {
                this.label[0].animate({scale: 1}, 500, "bounce");
                this.label[1].attr({"font-weight": 400});
                }
            }
        );
    }


    ldc.stats.pie.create = function(graph) {
            pie(graph);
            return graph;
    }




}
