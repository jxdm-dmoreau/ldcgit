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
    ldc.v.params();

    // init form
    ldc.v.form.init();

    // timeline
    ldc.v.timeline();


    // end --> init controller
    ldc.c.init();
    return false;
}



/******************************************************************************
  * log
******************************************************************************/
ldc.v.log = function (text) {
    $("#log").empty().append(text);
}

ldc.v.log.success = ldc.v.log;
ldc.v.log.error = ldc.v.log;


/******************* operations MODULE ***************************************/
ldc.v.operations = {};


/*
 * Convert a operation in html
 */
ldc.v.operations.html = function (op, compte)
{
    var html = '<tr>';
    html += '<td class="op-id">'+op.id+'</td>';
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

ldc.v.operations.table = [];
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
    html += '<button compte_id="'+compte.id+'" class="update" disabled="disabled">Modifier</button>';
    html += '<button compte_id="'+compte.id+'" class="del" disabled="disabled">Supprimer</button>';
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
    ldc.v.operations.table[compte.id] = dataTable;
}


ldc.v.operations.add = function (op)
{
    var total = 0;
    var html = '<ul>';
    for(var i in op.cats) {
        total += parseFloat(op.cats[i].val);
        var cat = ldc.m.categories.get(op.cats[i].id);
        if (!cat) {
            alert("Categorie "+op.cats[i].id+" not found!");
            return false;
        }
        html += '<li>'+cat.name+' ('+op.cats[i].val+'€)</li>';
    }
    html += '</ul>';
    if (op.from != 0) {
        ldc.v.operations.table[op.from].fnAddData( [op.id, op.date, total, 0, html, op.description]);
    }
    if (op.to != 0) {
        ldc.v.operations.table[op.to].fnAddData( [op.id, op.date, 0, total, html, op.description]);
    }

    return false;
}

ldc.v.operations.update = function (compte, op)
{
    return false;
}

ldc.v.operations.del = function (op)
{
    console.debug("op.from =>"+op.from);
    if (op.from != 0) {
        var jTr = $("#compte_"+op.from+" tr td.op-id:contains('"+op.id+"')").parents("tr");
        console.debug(jTr.html());
        ldc.v.operations.table[op.from].fnDeleteRow(jTr[0]);
    }
    console.debug("op.to =>"+op.to);
    if (op.to != 0) {
        var jTr = $("#compte_"+op.to+" tr td.op-id:contains('"+op.id+"')").parents("tr");
        console.debug(jTr.html());
        ldc.v.operations.table[op.to].fnDeleteRow(jTr[0]);
    }
    return false;
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


};




/******************************************************************************
  * STATS
******************************************************************************/

ldc.v.stats = function (jContainer) {


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
            autoOpen: false,
            draggable: false,
            title: 'Opérations',
            width: 500,
            resizable: false
    });
}



/******************************************************************************
  * Parameters
******************************************************************************/

ldc.v.params = function() {
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
}




/******************************************************************************
  * Comptes
******************************************************************************/

ldc.v.comptes = function(css_id) {
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


ldc.v.timeline = function() {
    $("#timeline").slider({
            range: true,
            animate: true,
    });
}

ldc.v.alert = function() {
    alert("alert");
}
