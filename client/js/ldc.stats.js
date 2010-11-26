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

    ldc.stats.updateCat = function() {
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
                var graph = {data: json, id:"stats-pie", title: cat_name};
                ldc.stats.pie.create(graph);
                IS_INIT = true;
                }
            );

        $.get("../server/get_evol_stats2.php?id="+cat_id+"&type=debit", function(data) {
                var json = JSON.parse(data);
                json.id = "stats-evol-debit";
                json.title = cat_name;
                json.ytitle = "Dépenses (€)";
                ldc.stats.bar(json);
                }
            );

        $.get("../server/get_evol_stats2.php?id="+cat_id+"&type=credit", function(data) {
                var json = JSON.parse(data);
                json.id = "stats-evol-credit";
                json.title = cat_name;
                json.ytitle = "Revenus (€)";
                ldc.stats.bar(json);
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
