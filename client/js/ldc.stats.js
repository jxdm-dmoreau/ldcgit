ldc.stats = function() {

    var SELECTOR = "#stats .graphs";
    var IS_INIT = false;
    ldc.stats.pie();

    ldc.stats.init = function() {
        var html = '<div id="test-stats"></div>';
        $(SELECTOR).append(html);
        html = '<div id="stats-evol"></div>';
        $(SELECTOR).append(html);



        $("#stats .header select").change(ldc.stats.update);

        Is_INIT = true;

        }




    ldc.stats.update = function() {
        var year = $("#stats .header select").val();
        $.get("../server/get_stats.php?id=0&year="+year, function(data) {
                var json = JSON.parse(data);
                var graph = {data: json, id:"test-stats", title:"Titre"};
                ldc.stats.pie.create(graph);
                IS_INIT = true;
                }
            );

        $.get("../server/get_evol_stats.php?id=0&year="+year, function(data) {
                var json = JSON.parse(data);
                var graph = {id:"stats-evol", title:"Evolution", ytitle:"Dépenses (€)", data:json};
                ldc.stats.bar(graph);
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
