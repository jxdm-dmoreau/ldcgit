ldc.op = function() {

    var ADD_URL    = "../server/add_operation.php";
    var UPDATE_URL = "../server/update_categorie.php";
    var DEL_URL    = "../server/del_categorie.php";
    var INIT_URL   = "../server/get_categories6.php";

    /* Add a categorie server and client side */
    ldc.op.add = function (op, cb) {

        function on_success(data, textStatus) {
            data = JSON.parse(data);
            var id = data.id;
            ldc.logger.success("Opération "+id+" ajoutée");
            /* callback if defined */
            if (cb != undefined) { cb(id); }
        }

        $.post(ADD_URL,  "json="+JSON.stringify(op) , on_success);
    }


}
