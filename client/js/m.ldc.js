

var ldc = {};
ldc.m = {};
ldc.m.SERVER="http://192.168.1.6/ldc/server/";

ldc.m.MONTHS = [
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
  * INIT
  ****************************************************************************/

ldc.m.init = function() 
{
    ldc.m.init.nb_ajax_calls++;
    $.getJSON(ldc.m.SERVER + "get_categories.php", ldc.m.categories.store);
    ldc.m.init.nb_ajax_calls++;
    $.getJSON(ldc.m.SERVER + "get_comptes.php",   ldc.m.comptes.store);
}

ldc.m.init.after_init = function()
{
    alert("Init modele ldc finished!");
    return false;
}

ldc.m.init.nb_ajax_calls = 0;

ldc.m.init.is_finished = function() 
{
    ldc.m.init.nb_ajax_calls--;
    console.debug("ldc.m.init.nb_ajax_calls="+ldc.m.init.nb_ajax_calls);
    if (ldc.m.init.nb_ajax_calls == 0) {
        ldc.c.init();
    }
}



/******************************************************************************
*  various functions
******************************************************************************/
ldc.m.post_ajax = function (url, data, f_success, async) {
    function f_error(XMLHttpRequest, textStatus, errorThrown) {
        ldc.view.log.error(textStatus+' '+errorThrown);
    }
    if (async == undefined) {
        async = true;
    }
    var param = { type: "POST", url: url, success: f_success, async: async, data: data, error: f_error};
    $.ajax(param);
};





/******************************************************************************
*  Categories functions
******************************************************************************/
ldc.m.categories = {};
ldc.m.categories.data = [];

ldc.m.categories.store = function (data, textStatus) {
    ldc.m.categories.data = data;
    console.debug("categories");
    ldc.m.init.is_finished();
};


ldc.m.categories.get_children = function (id) { 
    var children = [];
    for(var i in ldc.m.categories.data) {
        if (ldc.m.categories.data[i].father_id == id) {
            children.push(ldc.m.categories.data[i]);
        }
    }
    return children;
};

ldc.m.categories.get= function (id) {
    for (i in ldc.m.categories.data) {
        if (ldc.m.categories.data[i].id == id) {
            return ldc.m.categories.data[i];
        }
    }
    return false;
};

ldc.m.categories.get_from_name = function (name) {
    for (i in ldc.m.categories.data) {
        if (ldc.m.categories.data[i].name == name) {
            return ldc.m.categories.data[i];
        }
    }
    return false;
}


ldc.m.categories.add = function (name, father_id) {
    var id;
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.v.log.error("L'ajout de la catégorie a échoué...");
        } else {
            ldc.v.log.success("Catégorie ajoutée.");
        }
        data = JSON.parse(data);
        id = data.id;
    }
    var data = { name: name, father_id: father_id };
    ldc.m.post_ajax(ldc.m.SERVER + "add_categorie.php",  "json="+JSON.stringify(data) , on_success, false);
    data.id = ''+id;
    ldc.m.categories.data.push(data);
    return id;
};

ldc.m.categories.del = function (id) {
    function on_success(data, textStatus) {
        if (data == 1) {
            alert("La suppresion de la catégorie a échoué...");
        } else {
            ldc.v.log.success("Catégorie supprimée.");
        }
    }
    var data = { id: id };
    ldc.m.post_ajax(ldc.m.SERVER + "del_categorie.php",  "json="+JSON.stringify(data) , on_success, true);
    for(var i in ldc.m.categories) {
        if (ldc.m.categories[i].id == id) {
            delete(ldc.m.categories[i]);
            return;
        }
    }
};

ldc.m.categories.update = function(id, name, father_id) {
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.view.log.error("La Modification de la catégorie a échoué...");
        } else {
            ldc.view.log.success("Catégorie modifiée.");
        }
    }
    var data = { id: id, name: name, father_id: father_id };
    ldc.m.post_ajax(ldc.m.SERVER + "update_categorie.php",  "json="+JSON.stringify(data) , on_success, false);
    for(var i in ldc.m.categories) {
        if (ldc.m.categories[i].id == data.id) {
            ldc.m.categories[i] = data;
            return;
        }
    }
};



/******************************************************************************
*  Compte functions
******************************************************************************/
ldc.m.comptes = {};
ldc.m.comptes.data = [];

ldc.m.comptes.store = function (data, textStatus) {
    ldc.m.comptes.data = data;
    for(var i in ldc.m.comptes.data) {
        ldc.m.comptes.data[i].solde = parseFloat(ldc.m.comptes.data[i].solde_init);
    }
    var data = { date_begin:'2000-01-01', date_end:'2020-12-12'};
    ldc.m.init.nb_ajax_calls++;
    jQuery.post(ldc.m.SERVER + "get_operation.php",  "json="+JSON.stringify(data) , ldc.m.operations.store)
    console.debug("comptes");
    ldc.m.init.is_finished();
};



ldc.m.comptes.get = function (compte_id) {
    for(var i in ldc.m.comptes.data) {
        if(ldc.m.comptes.data[i].id == compte_id) {
            return ldc.m.comptes.data[i];
        }
    }
    return false;
}

ldc.m.comptes.get_solde = function (compte_id) {
    return ldc.m.comptes.get(compte_id).solde;
}

/******************************************************************************
*  Opérations functions
******************************************************************************/
ldc.m.operations = {};
ldc.m.operations.data = [];

ldc.m.operations.store = function (data, textStatus) {
    console.debug("ldc.m.operations.store");
    ldc.m.operations.data = JSON.parse(data);
    // read all operations and stats
    for(var i in ldc.m.operations.data) {
        var op = ldc.m.operations.data[i];
        var compte_from = ldc.m.comptes.get(op.from);
        var compte_to = ldc.m.comptes.get(op.to);
        for(var j in op.cats) {
            compte_from.solde -= parseFloat(op.cats[j].val);
            compte_to.solde += parseFloat(op.cats[j].val);
        }
    }
    console.debug("operations");
    ldc.m.init.is_finished();
};

ldc.m.operations.add= function (op) {
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.v.log.error("L'ajout de l'opération a échoué...");
        } else {
            ldc.v.log.success("Opération ajoutée.");
        }
        data = JSON.parse(data);
        op.id = data.id;
    }
    ldc.m.post_ajax(ldc.m.SERVER + "add_operation.php",  "json="+JSON.stringify(op) , on_success, false);
    ldc.m.operations.data.push(op);
    return op.id;
};

ldc.m.operations.del = function(id) {
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.v.log.error("La suppression de l'opération a échoué...");
        } else {
            ldc.v.log.success("Opération supprimée.");
        }
    }
    var data = { id: id};
    ldc.m.post_ajax(ldc.m.SERVER + "del_operation.php",  "json="+JSON.stringify(data) , on_success, true);
    for(var i in ldc.m.operations.data) {
        if (ldc.m.operations.data[i].id == id) {
            delete(ldc.m.operations.data[i]);
            break;
        }
    }
};

ldc.m.operations.update = function (op) {
    function on_success(data, textStatus) {
        if (data == 1) {
            ldc.v.log.error("La modification de l'opération a échoué...");
        } else {
            ldc.v.log.success("Opération Modifiée.");
        }
    }
    ldc.m.post_ajax(ldc.m.SERVER + "update_operation.php",  "json="+JSON.stringify(op) , on_success, true);
    for(var i in ldc.m.operations.data) {
        if (ldc.m.operations.data[i].id == op.id) {
            ldc.m.operations.data[i] = op;
            break;
        }
    }
};


ldc.m.operations.get = function (id)
{
    for(var i in ldc.m.operations.data) {
        if (ldc.m.operations.data[i].id == id) {
            return ldc.m.operations.data[i];
        }
    }
    return false;
}




window.ldc = ldc;




/******************************************************************************
*  Categories functions
******************************************************************************/
function ldc_cat_get_children(id) { 
    var children = [];
    for(var i in ldc.m.categories) {
        if (ldc.m.categories[i].father_id == id) {
            children.push(ldc.m.categories[i]);
        }
    }
    return children;
}



/******************************************************************************
  * STATS
******************************************************************************/
ldc.m.stats = function () {
    console.debug("ldc.m.stats()");
    for(var i in ldc.m.operations) {
        var op = ldc.m.operations[i];
        var compte = ldc.m.comptes.get(op.from);

    }
}

function extract_date(date) {
    var tmp = date.split(/-/);
    var year = parseFloat(tmp[0]);
    var month = parseFloat(tmp[1]);
    var day = parseFloat(tmp[2]);
    return {'day':day, 'month':month, 'year':year};
}


ldc.m.stats.get_cats = function(cat_id, compte_id, year, month) {
    var total = 0;
    for(var i in ldc.m.operations) {
        var op = ldc.m.operations[i];
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

ldc.m.stats.get_all_cats = function(cat_id, compte_id, year, month) {
    var total = 0;
    total += ldc.m.stats.get_cats(cat_id, compte_id, year, month);
    var children = ldc.m.categories.get_children(cat_id);
    for(var i in children) {
        total += ldc.m.stats.get_all_cats(children.id, compte_id,year, month);
    }
    return total;
}


