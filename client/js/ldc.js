/* MES VARIABLES */
var LDC_SERVER="http://192.168.1.6/ldc/server/"
var LDC_CATEGORIES;
var LDC_COMPTES;
var LDC_OPERATIONS;
var LDC_NB_LOAD = 0;
var LDC_TOTAL_LOAD = 3;

/* FUNCTIONS */
function ldc_post_ajax(url, data, f_success, async)
{
    function f_error(XMLHttpRequest, textStatus, errorThrown) {
        ldc_view_log_error(textStatus+' '+errorThrown);
    }
    if (async == undefined) {
        async = true;
    }
    var param = { type: "POST", url: url, success: f_success, async: async, data: data, error: f_error};
    $.ajax(param);
}


/******************************************************************************
*  Init Functions
******************************************************************************/
function ldc_is_load_completed() {
    LDC_NB_LOAD++;
    ldc_load(LDC_NB_LOAD/LDC_TOTAL_LOAD);
    if (LDC_NB_LOAD == LDC_TOTAL_LOAD) {
        ldc_load_completed();
    }
}

function ldc_store_categories(data, textStatus) {
    LDC_CATEGORIES = data;
    ldc_is_load_completed();
}

function ldc_store_comptes(data, textStatus) {
    LDC_COMPTES = data;
    ldc_is_load_completed();
}
function ldc_store_operations(data, textStatus) {
    LDC_OPERATIONS = JSON.parse(data);
    ldc_is_load_completed();
}


function ldc_register()
{
    ldc_view_init();
    $.getJSON(LDC_SERVER + "get_categories.php", ldc_store_categories);
    $.getJSON(LDC_SERVER + "get_comptes.php",   ldc_store_comptes);
    var data = { date_begin:'2000-01-01', date_end:'2020-12-12'};
    jQuery.post(LDC_SERVER + "get_operation.php",  "json="+JSON.stringify(data) , ldc_store_operations)
}


/******************************************************************************
*  Categories functions
******************************************************************************/
function ldc_cat_get_children(id) { 
    var children = [];
    for(var i in LDC_CATEGORIES) {
        if (LDC_CATEGORIES[i].father_id == id) {
            children.push(LDC_CATEGORIES[i]);
        }
    }
    return children;
}

function ldc_cat_get_name(id)
{
    for (i in LDC_CATEGORIES) {
        if (LDC_CATEGORIES[i].id == id) {
            return LDC_CATEGORIES[i].name;
        }

    }
    return "unknow";
}

function ldc_cat_add(name, father_id) {
    var id;
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc_view_log_error("L'ajout de la catégorie a échoué...");
        } else {
            ldc_view_log_success("Catégorie ajoutée.");
        }
        data = JSON.parse(data);
        id = data.id;
    }
    var data = { name: name, father_id: father_id };
    ldc_post_ajax(LDC_SERVER + "add_categorie.php",  "json="+JSON.stringify(data) , on_success, false);
    data.id = ''+id;
    LDC_CATEGORIES.push(data);
    return id;
}

function ldc_cat_del(id) {
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc_view_log_error("La suppresion de la catégorie a échoué...");
        } else {
            ldc_view_log_success("Catégorie supprimée.");
        }
    }
    var data = { id: id };
    ldc_post_ajax(LDC_SERVER + "del_categorie.php",  "json="+JSON.stringify(data) , on_success, true);
    for(var i in LDC_CATEGORIES) {
        if (LDC_CATEGORIES[i].id == id) {
            delete(LDC_CATEGORIES[i]);
            return;
        }
    }
}

function ldc_cat_update(id, name, father_id) {
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc_view_log_error("La Modification de la catégorie a échoué...");
        } else {
            ldc_view_log_success("Catégorie modifiée.");
        }
    }
    var data = { id: id, name: name, father_id: father_id };
    ldc_post_ajax(LDC_SERVER + "update_categorie.php",  "json="+JSON.stringify(data) , on_success, false);
    for(var i in LDC_CATEGORIES) {
        if (LDC_CATEGORIES[i].id == data.id) {
            LDC_CATEGORIES[i] = data;
            return;
        }
    }
}

/******************************************************************************
*  Opearations functions
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
}
