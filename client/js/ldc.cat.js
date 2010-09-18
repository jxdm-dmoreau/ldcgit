ldc.cat = function() {

    var ADD_URL="../server/add_categorie.php";
    var UPDATE_URL="../server/update_categorie.php";
    var DEL_URL="../server/del_categorie.php";

    ldc.cat.add = function (name, father_id, cb) {
        function on_success(data, textStatus) {
            data = JSON.parse(data);
            var id = data.id;
            ldc.logger.success("Catégorie "+id+" ajoutée");
            if (cb != undefined) {
                cb(id);
            }
        }
        var data = { name: name, father_id: father_id };
        $.post(ADD_URL,  "json="+JSON.stringify(data) , on_success);
    }

    ldc.cat.update = function(id, name, father_id, cb) {
        function on_success(data, textStatus) {
            ldc.logger.success("Catégorie "+id+" modifiée");
            if (cb != undefined) {
                cb(id);
            }
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
            if (cb != undefined) {
                cb(i);
            }
        }
        var data = { id: id };
        $.post(DEL_URL,  "json="+JSON.stringify(data) , on_success);
    }
}
