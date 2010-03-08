

var ldc = {};
ldc.SERVER="http://192.168.1.6/ldc/server/";
ldc.CATEGORIES = [];
ldc.COMPTES = [];
ldc.OPERATIONS = [];
ldc.nb_load = 0;
ldc.TOTAL_LOAD = 3;

/******************************************************************************
*  various functions
******************************************************************************/
ldc.post_ajax = function (url, data, f_success, async) {
    function f_error(XMLHttpRequest, textStatus, errorThrown) {
        ldc.view.log.error(textStatus+' '+errorThrown);
    }
    if (async == undefined) {
        async = true;
    }
    var param = { type: "POST", url: url, success: f_success, async: async, data: data, error: f_error};
    $.ajax(param);
};



ldc.load = function () {
    ldc.nb_load++;
    if (ldc.nb_load == ldc.TOTAL_LOAD) {
        ldc.view.load.completed();
    }
};

ldc.register = function () {
    ldc.view.preload();
    $.getJSON(ldc.SERVER + "get_categories.php", ldc.categories.store);
    $.getJSON(ldc.SERVER + "get_comptes.php",   ldc.comptes.store);
    var data = { date_begin:'2000-01-01', date_end:'2020-12-12'};
    jQuery.post(ldc.SERVER + "get_operation.php",  "json="+JSON.stringify(data) , ldc.operations.store)
};

/******************************************************************************
*  Categories functions
******************************************************************************/
ldc.categories = {};

ldc.categories.store = function (data, textStatus) {
    ldc.CATEGORIES = data;
    ldc.load();
};


ldc.categories.get_children = function (id) { 
    var children = [];
    for(var i in ldc.CATEGORIES) {
        if (ldc.CATEGORIES[i].father_id == id) {
            children.push(ldc.CATEGORIES[i]);
        }
    }
    return children;
};

ldc.categories.get_name= function (id) {
    for (i in ldc.CATEGORIES) {
        if (ldc.CATEGORIES[i].id == id) {
            return ldc.CATEGORIES[i].name;
        }
    }
    return "unknown";
};

ldc.categories.add = function (name, father_id) {
    var id;
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.view.log.error("L'ajout de la catégorie a échoué...");
        } else {
            ldc.view.log.success("Catégorie ajoutée.");
        }
        data = JSON.parse(data);
        id = data.id;
    }
    var data = { name: name, father_id: father_id };
    ldc.post_ajax(ldc.SERVER + "add_categorie.php",  "json="+JSON.stringify(data) , on_success, false);
    data.id = ''+id;
    ldc.CATEGORIES.push(data);
    return id;
};

ldc.categories.del = function (id) {
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.view.log.error("La suppresion de la catégorie a échoué...");
        } else {
            ldc.view.log.success("Catégorie supprimée.");
        }
    }
    var data = { id: id };
    ldc.post_ajax(ldc.SERVER + "del_categorie.php",  "json="+JSON.stringify(data) , on_success, true);
    for(var i in ldc.CATEGORIES) {
        if (ldc.CATEGORIES[i].id == id) {
            delete(ldc.CATEGORIES[i]);
            return;
        }
    }
};

ldc.categories.update = function(id, name, father_id) {
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.view.log.error("La Modification de la catégorie a échoué...");
        } else {
            ldc.view.log.success("Catégorie modifiée.");
        }
    }
    var data = { id: id, name: name, father_id: father_id };
    ldc.post_ajax(ldc.SERVER + "update_categorie.php",  "json="+JSON.stringify(data) , on_success, false);
    for(var i in ldc.CATEGORIES) {
        if (ldc.CATEGORIES[i].id == data.id) {
            ldc.CATEGORIES[i] = data;
            return;
        }
    }
};

/******************************************************************************
*  Compte functions
******************************************************************************/
ldc.comptes = {};

ldc.comptes.store = function (data, textStatus) {
    ldc.COMPTES = data;
    ldc.load();
};


/******************************************************************************
*  Opérations functions
******************************************************************************/
ldc.operations = {};

ldc.operations.store = function (data, textStatus) {
    ldc.OPERATIONS = JSON.parse(data);
    ldc.load();
};

ldc.operations.add= function (op) {
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.view.log.error("L'ajout de l'opération a échoué...");
        } else {
            ldc.view.log.success("Opération ajoutée.");
        }
        data = JSON.parse(data);
        op.id = data.id;
    }
    ldc.post_ajax(ldc.SERVER + "add_operation.php",  "json="+JSON.stringify(op) , on_success, false);
    ldc.OPERATIONS.push(op);
};

ldc.operations.del = function(id) {
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.view.log.error("La suppression de l'opération a échoué...");
        } else {
            ldc.view.log.success("Opération supprimée.");
        }
    }
    var data = { id: id};
    ldc.post_ajax(ldc.SERVER + "del_operation.php",  "json="+JSON.stringify(data) , on_success, true);
    for(var i in ldc.OPERATIONS) {
        if (ldc.OPERATIONS[i].id == id) {
            delete(ldc.OPERATIONS[i]);
            break;
        }
    }
};

ldc.operations.update = function (op) {
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.view.log.error("La modification de l'opération a échoué...");
        } else {
            ldc.view.log.success("Opération Modifiée.");
        }
    }
    ldc.post_ajax(ldc.SERVER + "update_operation.php",  "json="+JSON.stringify(op) , on_success, true);
    for(var i in ldc.OPERATIONS) {
        if (ldc.OPERATIONS[i].id == op.id) {
            ldc.OPERATIONS[i] = op;
            break;
        }
    }
};







window.ldc = ldc;


/******************************************************************************
*  Init Functions
******************************************************************************/


/******************************************************************************
*  Categories functions
******************************************************************************/
function ldc_cat_get_children(id) { 
    var children = [];
    for(var i in ldc.CATEGORIES) {
        if (ldc.CATEGORIES[i].father_id == id) {
            children.push(ldc.CATEGORIES[i]);
        }
    }
    return children;
}

function ldc_cat_get_name(id)
{
    for (i in ldc.CATEGORIES) {
        if (ldc.CATEGORIES[i].id == id) {
            return ldc.CATEGORIES[i].name;
        }

    }
    return "unknow";
}

function ldc_cat_add(name, father_id) {
    var id;
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.view.log.error("L'ajout de la catégorie a échoué...");
        } else {
            ldc.view.log.success("Catégorie ajoutée.");
        }
        data = JSON.parse(data);
        id = data.id;
    }
    var data = { name: name, father_id: father_id };
    ldc.post_ajax(LDC_SERVER + "add_categorie.php",  "json="+JSON.stringify(data) , on_success, false);
    data.id = ''+id;
    ldc.CATEGORIES.push(data);
    return id;
}

function ldc_cat_del(id) {
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.view.log.error("La suppresion de la catégorie a échoué...");
        } else {
            ldc.view.log.success("Catégorie supprimée.");
        }
    }
    var data = { id: id };
    ldc.post_ajax(LDC_SERVER + "del_categorie.php",  "json="+JSON.stringify(data) , on_success, true);
    for(var i in ldc.CATEGORIES) {
        if (ldc.CATEGORIES[i].id == id) {
            delete(ldc.CATEGORIES[i]);
            return;
        }
    }
}

function ldc_cat_update(id, name, father_id) {
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.view.log.error("La Modification de la catégorie a échoué...");
        } else {
            ldc.view.log.success("Catégorie modifiée.");
        }
    }
    var data = { id: id, name: name, father_id: father_id };
    ldc.post_ajax(LDC_SERVER + "update_categorie.php",  "json="+JSON.stringify(data) , on_success, false);
    for(var i in ldc.CATEGORIES) {
        if (ldc.CATEGORIES[i].id == data.id) {
            ldc.CATEGORIES[i] = data;
            return;
        }
    }
}

/******************************************************************************
*  Operations functions
******************************************************************************/
function ldc_somme(op)
{
    var total = 0;
    for(i in op.cats) {
        total += parseFloat(op.cats[i].val);
    }
    return total;
}

function ldc_op_add(op) {
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.view.log.error("L'ajout de l'opération a échoué...");
        } else {
            ldc.view.log.success("Opération ajoutée.");
        }
        data = JSON.parse(data);
        op.id = data.id;
    }
    ldc.post_ajax(LDC_SERVER + "add_operation.php",  "json="+JSON.stringify(op) , on_success, false);
    ldc.OPERATIONS.push(op);
}

function ldc_op_del(id) {
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.view.log.error("La suppression de l'opération a échoué...");
        } else {
            ldc.view.log.success("Opération supprimée.");
        }
    }
    var data = { id: id};
    ldc.post_ajax(LDC_SERVER + "del_operation.php",  "json="+JSON.stringify(data) , on_success, true);
    for(var i in ldc.OPERATIONS) {
        if (ldc.OPERATIONS[i].id == id) {
            delete(ldc.OPERATIONS[i]);
            break;
        }
    }
}

function ldc_op_update(op) {
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.view.log.error("La modification de l'opération a échoué...");
        } else {
            ldc.view.log.success("Opération Modifiée.");
        }
    }
    ldc.post_ajax(LDC_SERVER + "update_operation.php",  "json="+JSON.stringify(op) , on_success, true);
    for(var i in ldc.OPERATIONS) {
        if (ldc.OPERATIONS[i].id == op.id) {
            ldc.OPERATIONS[i] = op;
            break;
        }
    }
}
/******************************************************************************
  * STATS
******************************************************************************/
