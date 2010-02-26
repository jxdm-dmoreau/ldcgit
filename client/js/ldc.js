/* MES VARIABLES */
var LDC_SERVER="http://192.168.1.6/ldc/server/"
var LDC_CATEGORIES;
var LDC_COMPTES;
var LDC_OPERATIONS;
var LDC_NB_LOAD = 0;
var LDC_TOTAL_LOAD = 3;

/* FUNCTIONS */
function ldc_get_ajax_post(url, f_success)
{
    var param = { type: "POST", url: url, success: f_success, async: true};
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
