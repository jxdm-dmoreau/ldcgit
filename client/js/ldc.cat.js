ldc.cat = function() {

    ldc.cat.data = {};

    var ADD_URL    = "../server/add_categorie.php";
    var UPDATE_URL = "../server/update_categorie.php";
    var DEL_URL    = "../server/del_categorie.php";
    var INIT_URL   = "../server/get_categories6.php";


    /* Add a categorie server and client side */
    ldc.cat.add = function (name, father_id, cb) {

        var data = { name: name, father_id: father_id };

        function on_success(data, textStatus) {
            data = JSON.parse(data);
            var id = data.id;
            ldc.logger.success("Catégorie "+id+" ajoutée");
            /* client */
            initDataFromServer();
            /* callback if defined */
            if (cb != undefined) { cb(id); }
        }

        $.post(ADD_URL,  "json="+JSON.stringify(data) , on_success);
    }




    ldc.cat.rename = function(id, name, father_id, cb) {
        function on_success(data, textStatus) {
            if (data == 1) {
                ldc.logger.error("Erreur renommage catégorie "+id);
                return false;
            }
            ldc.logger.success("Catégorie "+id+" modifiée");
            /* client */
            initDataFromServer();
            /* callback if defined */
            if (cb != undefined) { cb(id); }
        }
        var data = { id: id, name: name, father_id: father_id };
        $.post(UPDATE_URL,  "json="+JSON.stringify(data) , on_success);
    }


    ldc.cat.del = function (id, cb) {
        function on_success(data, textStatus) {
            if (data == 1) {
                ldc.logger.error("Erreur lors de la suppression de la catégie "+id);
                return false;
            }
            ldc.logger.success("Catégorie "+id+" supprimée");
            /* client */
            initDataFromServer();
            /* callback if defined */
            if (cb != undefined) { cb(id); }
        }
        var data = { id: id };
        $.post(DEL_URL,  "json="+JSON.stringify(data) , on_success);
    }

    function initDataFromServer()
    {
        $.getJSON("../server/get_categories6.php",
            function(data) {
                ldc.cat.data.byName = data;
                ldc.cat.data.names = [];
                for (var i in data) {
                    ldc.cat.data.names.push(i);
                }
            }
        );
    }


    /* Init */
    initDataFromServer();


}
