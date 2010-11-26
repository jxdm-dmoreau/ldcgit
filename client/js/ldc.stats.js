ldc.stats = function() {

    var SELECTOR = "#stats .graphs";
    var IS_INIT = false;
    ldc.stats.pie();

    ldc.stats.init = function() {

        $.get("../server/get_evol_solde_stats2.php", function(data) {
                var json = JSON.parse(data);
                json.id = "stats-area";
                json.title = "Capital (€)"
                ldc.stats.area(json);
                }
        );


        ldc.stats.updateHeader();
        Is_INIT = true;

    }


    ldc.stats.updateHeader = function() {
        $("#stats .header span.cats").load("../server/get_cat_cb.php", function() {
            $("#stats .header select.cats").change(ldc.stats.updateCat);
        });
        $("#stats .header span.year").load("../server/get_year_cb.php", function() {
            $("#stats .header select.year").change(ldc.stats.updateCat);
        });
    }

    function toto(cat_id) {
        DEBUG(cat_id);
        var html = '<div id="toto"></div>';
        $("#stats").append(html);

        $.get("../server/get_evol_stats2.php?id="+cat_id, function(data) {
                var json = JSON.parse(data);
                json.id = "toto";
                json.title = "tmp";
                ldc.stats.line(json);
                }
            );
    }


    ldc.stats.updateCat = function(cat_id) {
        var year = $("#stats .header select.year").val();
        if (cat_id == undefined) {
            cat_id = $("#stats .header select.cats").val();
        }
        var cat_name = $("#stats .header select.cats option[value='"+cat_id+"']").text();

        if (year == undefined || cat_id == undefined) {
            var d = new Date();
            year = d.getFullYear();
            cat_id = "0";
            cat_name = "Catégories";
        }

        $.get("../server/get_stats.php?id="+cat_id+"&year="+year, function(data) {
                var json = JSON.parse(data);
                var graph = {data: json, id:"stats-pie-debit", title: cat_name};
                graph.onClick = toto;
                ldc.stats.pie.create(graph);
                IS_INIT = true;
                }
            );

        $.get("../server/get_evol_stats2.php?id="+cat_id, function(data) {
                var json = JSON.parse(data);
                json.id = "stats-evol-line";
                json.title = cat_name;
                ldc.stats.line(json);
                }
            );

    }

    ldc.stats.update = function() {
        ldc.stats.updateCat();
    }


    ldc.stats.display = function() {
        if (!IS_INIT) {
            ldc.stats.init();
        }
        ldc.stats.update();
        $("#stats").show();
        return false;
    }

}
