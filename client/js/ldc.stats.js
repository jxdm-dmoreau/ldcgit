ldc.stats = function() {

    var SELECTOR = "#stats";
    var IS_INIT = false;

    ldc.stats.init = function() {
        var html = '<div id="test-stats"></div>';
        $(SELECTOR).append(html);


        $.get("../server/get_stats.php?id=0&year=2010", function(data) {
                var json = JSON.parse(data);
                var legend= [];
                var data = [];
                for(var i in json) {
                    legend.push("%%.%% - "+json[i].name);
                    data.push(json[i].value);
                }
                var r = Raphael("test-stats");
                r.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
                r.g.text(320, 100, "Interactive Pie Chart").attr({"font-size": 20});
                var pie = r.g.piechart(320, 240, 100, data,
                    {legend: legend,
                    legendpos: "west",
                    href: ["http://raphaeljs.com", "http://g.raphaeljs.com"]});
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


                IS_INIT = true;
                }
            );



        }

    ldc.stats.display = function() {
        if (!IS_INIT) {
            ldc.stats.init();
        }
        $(SELECTOR).show();
        return false;
    }

}
