ldc.op = function() {

    var ADD_URL    = "../server/add_operation.php";
    var UPDATE_URL = "../server/update_operation.php";
    var DEL_URL    = "../server/del_operation.php";
    var GET_URL    = "../server/get_operation3.php";

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


    ldc.op.del = function (id, cb) {
        function on_success(data, textStatus) {
            if (data == 1) {
                ldc.logger.error("Erreur lors de la suppression de l'opération "+id);
                return false;
            }
            ldc.logger.success("Opération "+id+" supprimée");
            /* callback if defined */
            if (cb != undefined) { cb(id); }
        }
        var data = { id: id };
        $.post(DEL_URL,  "json="+JSON.stringify(data) , on_success);
    }


    ldc.op.update = function(op, cb) {
        function on_success(data, textStatus) {
            if (data == 1) {
                ldc.logger.error("Erreur modification opération "+id);
                return false;
            }
            ldc.logger.success("Opération "+op.id+" modifiée");
            /* callback if defined */
            if (cb != undefined) { cb(); }
        }
        $.post(UPDATE_URL,  "json="+JSON.stringify(op) , on_success);
    }

    ldc.op.get = function(id, cb) {
        function on_success(data, textStatus) {
            if (data == 1) {
                ldc.logger.error("Erreur get opération "+id);
                return false;
            }
            var op = JSON.parse(data);
            /* callback if defined */
            if (cb != undefined) { cb(op[0]); }
        }
        $.get(GET_URL+"?id="+id, on_success);
    }

}
