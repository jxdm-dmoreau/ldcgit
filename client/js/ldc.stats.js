ldc.stats = function() {

    var SELECTOR = "#stats .graphs";
    var IS_INIT = false;
    ldc.stats.pie();

    ldc.stats.init = function() {
        var html = '<div id="stats-area"></div>';
        $(SELECTOR).append(html);
        html = '<div id="test-stats"></div>';
        $(SELECTOR).append(html);
        html = '<div id="stats-evol"></div>';
        $(SELECTOR).append(html);



        ldc.stats.updateHeader();
        Is_INIT = true;

    }


    ldc.stats.updateHeader = function() {
        $("#stats .header span.cats").load("../server/get_cat_cb.php", function() {
            $("#stats .header select.cats").change(ldc.stats.update);
        });
        $("#stats .header span.year").load("../server/get_year_cb.php", function() {
            $("#stats .header select.year").change(ldc.stats.update);
        });
    }


    ldc.stats.update = function() {
        var year = $("#stats .header select.year").val();
        var cat_id = $("#stats .header select.cats").val();
        var cat_name = $("#stats .header select.cats option[value='"+cat_id+"']").text();

        if (year == undefined || cat_id == undefined) {
            var d = new Date();
            year = d.getFullYear();
            cat_id = "0";
            cat_name = "Catégories";
        }

        $.get("../server/get_stats.php?id="+cat_id+"&year="+year, function(data) {
                var json = JSON.parse(data);
                var graph = {data: json, id:"test-stats", title: cat_name};
                ldc.stats.pie.create(graph);
                IS_INIT = true;
                }
            );

        $.get("../server/get_evol_stats.php?id="+cat_id+"&year="+year, function(data) {
                var json = JSON.parse(data);
                var graph = {id:"stats-evol", title:cat_name, ytitle:"Dépenses (€)", data:json};
                ldc.stats.bar(graph);
                }
            );
        $.get("../server/get_evol_solde_stats.php?year="+year, function(data) {
                var json = JSON.parse(data);
                var graph = {};
                graph.id = "stats-area";
                graph.data = json;
                ldc.stats.area(graph);
                }
            );
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
