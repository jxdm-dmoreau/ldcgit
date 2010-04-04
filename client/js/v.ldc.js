/******************************************************************************
  * VIEW
******************************************************************************/
ldc.v = {};


ldc.v.init = function ()
{
    // tabs + liste des opérations
    for(var i in ldc.m.comptes.data) {
        var c = ldc.m.comptes.data[i];
        var id = "compte_"+c.id;
        $("#tabs ul.tabs").append('<li><a href="#compte_'+c.id+'">'+c.name+'</a></li>');
        ldc.v.operations.init($("#tabs"), id, c);
    }
    $("#tabs").tabs();

    // init params
    ldc.v.categories.init($("#params li.cats"), "cats");
    $("#params").dialog({
            buttons: { "Fermer": function() { $("#params").dialog('close');}},
            modal: true,
            autoOpen: false,
            draggable: false,
            resizable: false,
            title: 'Paramères',
            width: 500,
            hide: 'slide',
            closeText: 'hide'
    });

    // init form
    ldc.v.form.init();

    // end --> init controller
    ldc.c.init();
    return false;
}


ldc.view = function () {
    $("#main").show();
    /* on initialise tous (tableaux etc) */
    // operations by compte
    for (var i in ldc.m.COMPTES) {
        console.debug("compte="+ldc.m.COMPTES[i].id);
        ldc.v.modules.operations.init($("#main"), ldc.m.COMPTES[i]);
    }

    $("#button_test").click(function() {
            ldc.v.modules.operations.del(ldc.m.operations.get(1),ldc.m.COMPTES.get(3)); 
            return false;
    });
    var i = 0;
    for ( i in ldc.m.COMPTES) {
        ldc.v.modules.operations.show(ldc.m.COMPTES[i]);
    }
};


/******************************************************************************
  * log
******************************************************************************/
ldc.v.log = function (text) {
    $("#log").empty().append(text);
}

ldc.v.log.success = ldc.v.log;
ldc.v.log.error = ldc.v.log;

/******************************************************************************
  * MODULES
******************************************************************************/

/* 
   Liste des modules :
   - operations
   - categories
   - menu
*/

ldc.v.modules = {};

/******************* operations MODULE ***************************************/
ldc.v.operations = {};


/*
 * Convert a operation in html
 */
ldc.v.operations.html = function (op, compte)
{
    var html = '<tr operations_id="'+op.id+'">';
    html += '<td>'+op.id+'</td>';
    html += '<td>'+op.date+'</td>';
    var total = 0;
    for(var i in op.cats) {
        total += parseFloat(op.cats[i].val);
    }
    if (compte.id == op.from) {
        html += '<td>'+total+'€</td><td>0€</td>';
    } else {
        html += '<td>0€</td><td>'+total+'€</td>';
    }
    // cats
    html += '<td><ul>';
    for(var i in op.cats) {
        var cat = ldc.m.categories.get(op.cats[i].id);
        if (!cat.name) {
            alert("Categorie "+op.cats[i].id+" not found!");
            return false;
        }
        html += '<li>'+cat.name+' ('+op.cats[i].val+'€)</li>';
    }
    html += '</ul></td>';
    html += '<td>'+op.description+'</td>'
    html += '</tr>';
    return html;
}

/*
 * Init Operation module
 */
ldc.v.operations.init = function (jContainer, id, compte) {
    /* add a div and hide it */
    var div = '<div class="operations" id="'+id+'"></div>';
    jContainer.append(div);
    jDiv = $("#"+id);
    //jDiv.hide();
    /* generate html */
    var html = '<button compte_id="'+compte.id+'" class="add">Ajouter</button>';
    html += '<button class="update">Modifier</button>';
    html += '<button class="del">Supprimer</button>';
    html += '<table compte_id="'+compte.id+'" class="operations-table">';
    html += '<thead><tr><th>id</th><th>date</th><th>Débit</th><th>Crédit</th><th>Catégories</th><th>Description</th></tr></thead><tbody>';
    for (var j in ldc.m.operations.data) {
        var from = ldc.m.operations.data[j].from;
        var to =  ldc.m.operations.data[j].to;
        if (from == compte.id | to == compte.id) {
            html += ldc.v.operations.html(ldc.m.operations.data[j], compte);
        }
    }
    html += '</tbody>';
    /* add to the the div */
    jDiv.append(html);
    /* generate the dataTable */
    var dataTable = $("#"+id+" table").dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers"
    });
    /* store the dataTable object (needed to add new values ...) */
    ldc.v.operations.table = [];
    ldc.v.operations.table[compte.id] = dataTable;
}


ldc.v.operations.add = function (compte, op)
{
    return false;
}

ldc.v.operations.update = function (compte, op)
{
    return false;
}

ldc.v.operations.del = function (compte, op)
{
    var jTr = $("div[compte_id="+compte.id+"] tr[operations_id="+op.id+"]");
    ldc.v.modules.operations.table[compte.id].fnDeleteRow(jTr[0]);
    return false;
}



    /* ACTIONS */
    /* function to add operation in the HTML table */
/*
    $(css_id+" button.add").button();
    $(css_id+" button.add").click(function() {
            ldc.view.form.show(compte_id);
    });
    $(css_id+" button.update").button();
    $(css_id+" button.update").click(function() {
            var op = { id:46, from:2, to:3, date:'2010-01-01', confirm:1, cats: [{ id:1, val:12}]};
            ldc.m.operations.update(op);
    });
    $(css_id+" button.del").button();
    $(css_id+" button.del").click(function() {
            var id = $(css_id+" .ui-state-highlight").children().first().text();
            if (confirm("Voulez-vous supprimer l'opération "+id+"?")) {
                //ldc.m.operations.del(id)i;
                var jTr = $(css_id+" .ui-state-highlight");
                ldc.view.operations.del(dataTable, jTr[0]);
            }

    });
    $(css_id).delegate("tr", "click", function() {
        $(css_id+" .ui-state-highlight").removeClass("ui-state-highlight");
        $(this).addClass("ui-state-highlight");
        var id = $(this).children().first().text();

    });
    */








/******************************************************************************
  * Menu
******************************************************************************/
/* constructeur du menu */
ldc.v.menu = function (jContainer) {
    var html = '<div id="menu">';
    html += '<ul>';
    html += '<li>Comptes';
    html += '<ul>';
    for (var i in ldc.m.COMPTES) {
        var c = ldc.m.COMPTES[i];
        html += '<li><a href="#" compte_id="'+c.id+'">'+c.bank+' - '+c.name+'</a></li>';
    }
    html += '</ul></li>';
    html += '<li>Paramètres</li>';
    html += '</ul>';
    html += '</div>';
    jContainer.append(html);


}


/******************************************************************************
  * categories
******************************************************************************/
ldc.v.categories = {};
ldc.v.categories.init = function (jContainer, id) {

    var div = '<div class="categories" id="'+id+'"></div>';
    jContainer.append(div);
    jDiv = $("#"+id);

    function display_cat_r(cat, html) {
        html += '<li cat_id="'+cat.id+'"><a href="#"><ins>&nbsp;</ins>'+cat.name+'</a>';
        var children = ldc.m.categories.get_children(cat.id);
        if (children.length > 0) {
            html += '<ul>';
            for(var i in children) {
                html = display_cat_r(children[i], html);
            }
            html += '</ul>';
        }
        html += '</li>';
        return html;
    }

    html = '<ul>';
    html += '<li rel="root" cat_id="0"><a href="#"><ins>&nbsp;</ins>Catégories</a><ul>';
    var children = ldc.m.categories.get_children(0);
    for(var i in children) {
        html = display_cat_r(children[i], html);
    }
    html += '</ul></li></ul>';
    jDiv.append(html);

    $("#"+id).tree( {
        callback: {
            onrename : ldc.c.params.onrename_categories,
            ondelete : ldc.c.params.ondelete_categories,
            onmove   : ldc.c.params.onmove_categories
        },
        types: {
            "root" : {
                clickable   : true,
                deletable   : false,
                draggable   : false,
            }
        }
    });


    /*
    $(css_id+" button.add").click(function() {
        is_creation = true;
        var t = $.tree.focused();
        if(t.selected) {
            t.create();
        } else {
            alert("Select a node first");
        }
    });

    $(css_id+" button.del").click(function() {
        if(confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
            $.tree.focused().remove();
        }
    });

    $(css_id+" button.rename").click(function() {
                is_update = true;
                $.tree.focused().rename();
    });
*/

};




/******************************************************************************
  * STATS
******************************************************************************/

ldc.view.stats = function (jContainer) {


    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');
    data.addRows(12);
    for (var i in ldc.MONTHS) {
        i = parseInt(i);
        data.setValue(i, 0, ldc.MONTHS[i].name);
    }
    var children = ldc.m.categories.get_children(0);
    for (var i in children) {
        data.addColumn('number', children[i].name);
    }
    for (var i in children) {
        for(var j in ldc.MONTHS) {
            var v = ldc.stats.get_all_cats(children[i].id, 2, '2010', ldc.MONTHS[j].num);
            data.setValue(parseInt(j), parseInt(i)+1, v);
        }
    }
    var html = '<div id="stats"></div>';
    jContainer.append(html);
    var chart = new google.visualization.ColumnChart(document.getElementById("stats"));
    chart.draw(data, {width: 600, height: 340, legend: 'bottom', title: 'Company Performance'});
}





ldc.drawChart = function () {
    /*
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');
    data.addColumn('number', 'Débit');
    var d= [ ["2009-01-01", 1], ['2009-01-02',2]];
    data.addRows(d);
    ldc.chart = new google.visualization.LineChart(document.getElementById("stats"));
    ldc.chart.draw(data, {width: 600, height: 340, legend: 'bottom', title: 'Company Performance'});
    */

}

/******************************************************************************
  * Formulaire
******************************************************************************/
ldc.v.form = {};

ldc.v.form.init = function() {
    // complete HTML
    for(var i in ldc.m.comptes.data) {
        var name = ldc.m.comptes.data[i].bank + ' - ' + ldc.m.comptes.data[i].name;
        var id = ldc.m.comptes.data[i].id;
        $("div#form li.from select").append('<option value="'+id+'">'+name+'</option>');
        $("div#form li.to select").append('<option value="'+id+'">'+name+'</option>');
    }
    $("div#form li.to select").append('<option value="0">Extérieur</option>');
    $("div#form li.from select").append('<option value="0">Extérieur</option>');


    // datepicker
    $("#datepicker").datepicker({ dateFormat: 'yy-mm-dd' });
    // radios
    $("#type").buttonset();
    // dialog
    $("#form").dialog({ 
            modal: true,
            buttons: { "Ok": ldc.c.operations.add},
            autoOpen: false
    });
}



/******************************************************************************
  * Parameters
******************************************************************************/

ldc.view.params = function(css_id) {
    ldc.view.params.id = css_id;
}


ldc.view.params.show = function () {
    $(ldc.view.params.id).show();
}

ldc.view.params.hide = function () {
    $(ldc.view.params.id).hide();
}



/******************************************************************************
  * Comptes
******************************************************************************/

ldc.view.comptes = function(css_id) {
    $(css_id).hide();
    $(css_id).empty();
    var table = '<table><thead><th>id</th><th>Banque</th><th>Nom</th><th>Solde initial</th><th>Solde Courant</th></thead>';
    for(var i in ldc.m.COMPTES) {
        var id = ldc.m.COMPTES[i].id;
        var banque = ldc.m.COMPTES[i].bank;
        var name = ldc.m.COMPTES[i].name;
        var solde_init = ldc.m.COMPTES[i].solde_init;
        var solde = ldc.m.COMPTES.get_solde(ldc.m.COMPTES[i].id);
        table += '<tr><td>'+id+'</td><td>'+banque+'</td><td>'+name+'</td><td>'+solde_init+'</td><td>'+solde+'</td></tr>';
    }
    table += '</table>';
    $(css_id).append(table);
    $(css_id).show();

    $(css_id).delegate("tr", "click", open_operations );

    function open_operations() {
       jThis = $(this);
       var compte_id = jThis.children().first().text();
       ldc.view.all.hide();
       ldc.view.operations("div#operations", compte_id);

    }
}

