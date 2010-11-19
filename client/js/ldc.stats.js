ldc.stats = function() {

    var SELECTOR = "#stats";
    var IS_INIT = false;
    ldc.stats.pie();

    ldc.stats.init = function() {
        var html = '<div id="test-stats"></div>';
        $(SELECTOR).append(html);
        html = '<div id="stats-evol"></div>';
        $(SELECTOR).append(html);


        $.get("../server/get_stats.php?id=0&year=2010", function(data) {
                var json = JSON.parse(data);
                var legend= [];
                var data = [];
                for(var i in json) {
                    legend.push("%%.%% - "+json[i].name);
                    data.push(json[i].value);
                }
                ldc.stats.pie.create({ id: "test-stats", data: data, legend:legend});

                IS_INIT = true;
                }
            );

        var r = Raphael('stats-evol');

           fin = function () {
                this.flag = r.g.popup(this.bar.x, this.bar.y, this.bar.value || "0").insertBefore(this);
            }
        fout = function () {
            this.flag.animate({opacity: 0}, 300, function () {this.remove();});
    }
        var labels = [["test", "test2", "fds", "fsd", "", "", "", ""]];
        r.g.barchart(10, 10, 300, 220, [[55, 20, 13, 32, 5, 1, 2, 10]], {axis: "0 0 1 1"}).hover(fin, fout).label(labels);





        }

    ldc.stats.display = function() {
        if (!IS_INIT) {
            ldc.stats.init();
        }
        $(SELECTOR).show();
        return false;
    }

}
