

var ldc = {};
ldc.SERVER="http://192.168.1.6/ldc/server/";
ldc.CATEGORIES = [];
ldc.COMPTES = [];
ldc.OPERATIONS = [];
ldc.nb_load = 0;
ldc.TOTAL_LOAD = 3;

ldc.MONTHS = [
    {name:'Janvier',   num:'01'},
    {name:'Février',   num:'02'},
    {name:'Mars',      num:'03'},
    {name:'Avril',     num:'04'},
    {name:'Mai',       num:'05'},
    {name:'Juin',      num:'06'},
    {name:'Juillet',   nmu:'07'},
    {name:'Août',      num:'08'},
    {name:'Septembre', num:'09'},
    {name:'Octobre',   num:'10'},
    {name:'Novembre',  num:'11'},
    {name:'Décembre',  num:'12'},
];


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
    $.getJSON(ldc.SERVER + "get_comptes.php",   ldc.comptes.store);
    $.getJSON(ldc.SERVER + "get_categories.php", ldc.categories.store);
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
    return false;
};

ldc.categories.get_from_name = function (name) {
    for (i in ldc.CATEGORIES) {
        if (ldc.CATEGORIES[i].name == name) {
            return ldc.CATEGORIES[i];
        }
    }
    return false;
}


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
    for(var i in ldc.COMPTES) {
        ldc.COMPTES[i].solde = parseFloat(ldc.COMPTES[i].solde_init);
    }
    var data = { date_begin:'2000-01-01', date_end:'2020-12-12'};
    jQuery.post(ldc.SERVER + "get_operation.php",  "json="+JSON.stringify(data) , ldc.operations.store)
    ldc.load();
};



ldc.comptes.get = function (compte_id) {
    for(var i in ldc.COMPTES) {
        if(ldc.COMPTES[i].id == compte_id) {
            return ldc.COMPTES[i];
        }
    }
    return false;
}

ldc.comptes.get_solde = function (compte_id) {
    return ldc.comptes.get(compte_id).solde;
}

/******************************************************************************
*  Opérations functions
******************************************************************************/
ldc.operations = {};

ldc.operations.store = function (data, textStatus) {
    ldc.OPERATIONS = JSON.parse(data);
    // read all operations and stats
    for(var i in ldc.OPERATIONS) {
        var op = ldc.OPERATIONS[i];
        var compte_from = ldc.comptes.get(op.from);
        var compte_to = ldc.comptes.get(op.to);
        for(var j in op.cats) {
            compte_from.solde -= parseFloat(op.cats[j].val);
            compte_to.solde += parseFloat(op.cats[j].val);
        }
    }
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
    return op.id;
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



/******************************************************************************
  * STATS
******************************************************************************/
ldc.stats = function () {
    console.debug("ldc.stats()");
    for(var i in ldc.OPERATIONS) {
        var op = ldc.OPERATIONS[i];
        var compte = ldc.comptes.get(op.from);

    }
}

function extract_date(date) {
    var tmp = date.split(/-/);
    var year = parseFloat(tmp[0]);
    var month = parseFloat(tmp[1]);
    var day = parseFloat(tmp[2]);
    return {'day':day, 'month':month, 'year':year};
}


ldc.stats.get_cats = function(cat_id, compte_id, year, month) {
    var total = 0;
    for(var i in ldc.OPERATIONS) {
        var op = ldc.OPERATIONS[i];
        var date = extract_date(op.date);
        if (date.year != year | date.month != month) {
            continue;
        }
        if (op.from != compte_id) {
            continue;
        }
        for(var j in op.cats) {
            var cat = op.cats[j];
            if (cat.cat_id != cat_id) {
                continue;
            }
            total += parseFloat(cat.val);
        }
    }
    return total;
}

ldc.stats.get_all_cats = function(cat_id, compte_id, year, month) {
    var total = 0;
    total += ldc.stats.get_cats(cat_id, compte_id, year, month);
    var children = ldc.categories.get_children(cat_id);
    for(var i in children) {
        total += ldc.stats.get_all_cats(children.id, compte_id,year, month);
    }
    return total;
}


