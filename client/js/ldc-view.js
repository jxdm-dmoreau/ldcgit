/******************************************************************************
  * VIEW
******************************************************************************/

ldc.view = function () {
    ldc.view.all.hide();
    ldc.view.menu("div#menu");
    ldc.view.load(2/ldc.view.NB_LOAD_MAX);
    ldc.view.form("div#form");
    ldc.view.load(3/ldc.view.NB_LOAD_MAX);
    ldc.view.categories("div#cats");
    ldc.view.load(4/ldc.view.NB_LOAD_MAX);
    ldc.view.load(5/ldc.view.NB_LOAD_MAX);
    ldc.view.categories("div#cats");
    ldc.view.load(6/ldc.view.NB_LOAD_MAX);
    ldc.view.load(7/ldc.view.NB_LOAD_MAX);
    ldc.view.load(8/ldc.view.NB_LOAD_MAX);
    $("#log").empty();
    $("#main").show();
};

ldc.view.NB_LOAD_MAX = 8;

/******************************************************************************
  * all
******************************************************************************/
ldc.view.all = {};

ldc.view.all.hide = function () {
    ldc.view.form.hide();
    ldc.view.categories.hide();
    ldc.view.categories.hide();
    $("#stats").hide();
    $("#comptes").hide();
    $("#operations").hide();
}


/******************************************************************************
  * LOAD
******************************************************************************/
ldc.view.preload = function () {
    $("#main").hide();
    $("#log").empty().append('<div id="pb"></div>');
    $("#pb").css('width', '300px');
    $("#pb").progressbar({ value: 1 });
}

ldc.view.load = function (percent) {
    var length = percent * $("#pb").width();
    console.debug("pb "+length);
    $("#pb").progressbar('option', 'value', length);
};

ldc.view.load.completed = function () {
    ldc.view.load(1/8);
    ldc.view();
};

/******************************************************************************
  * LOG
******************************************************************************/
ldc.view.log = function(msg) {
    console.debug(msg);
};
ldc.log = ldc.view.log;

ldc.view.log.success = function (msg) {
    $("#log").empty().addClass('success').append(msg);
}

ldc.view.log.error = function (msg) {
    $("#log").empty().addClass('error').append(msg);
}

/******************************************************************************
  * view operations
******************************************************************************/


ldc.view.operations = function(css_id, compte_id) {
    /* VIEW */
    $(css_id).hide();
    var compte = ldc.comptes.get(compte_id);
    var html = '<div>'+'<h1>'+compte.bank+' - '+compte.name+'</h1>';
    html += '<table compte_id="'+compte.id+'" class="operations-table">';
    html += '<thead><tr><th>id</th><th>date</th><th>Débit</th><th>Crédit</th><th>Catégories</th><th>Description</th></tr></thead><tbody>';
    for (var j in ldc.OPERATIONS) {
        var from = ldc.OPERATIONS[j].from;
        var to =  ldc.OPERATIONS[j].to;
        if (from == compte_id | to == compte_id) {
            html += ldc.view.operations.html(ldc.OPERATIONS[j], compte_id);
        }
    }
    html += '</tbody>';
    $(css_id).append(html);
    var dataTable = $(".operations-table").dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers"
    });

    ldc.view.operations.table = [];
    ldc.view.operations.table[compte_id] = dataTable;
    /* ACTIONS */
    /* function to add operation in the HTML table */

    $(css_id+" button.add").button();
    $(css_id+" button.add").click(function() {
            ldc.view.form.show(compte_id);
    });
    $(css_id+" button.update").button();
    $(css_id+" button.update").click(function() {
            var op = { id:46, from:2, to:3, date:'2010-01-01', confirm:1, cats: [{ id:1, val:12}]};
            ldc.operations.update(op);
    });
    $(css_id+" button.del").button();
    $(css_id+" button.del").click(function() {
            var id = $(css_id+" .ui-state-highlight").children().first().text();
            if (confirm("Voulez-vous supprimer l'opération "+id+"?")) {
                //ldc.operations.del(id)i;
                var jTr = $(css_id+" .ui-state-highlight");
                ldc.view.operations.del(dataTable, jTr[0]);
            }

    });
    $(css_id).delegate("tr", "click", function() {
        $(css_id+" .ui-state-highlight").removeClass("ui-state-highlight");
        $(this).addClass("ui-state-highlight");
        var id = $(this).children().first().text();

    });
    $(css_id).show();


}

ldc.view.operations.del = function (dataTable, tr) {
    dataTable.fnDeleteRow(tr);
}


ldc.view.operations.add = function () {

    /* construct op from form */
    var op = {};
    // date
    $(ldc.view.form.id+' .ui-state-error').removeClass('ui-state-error');
    var date = $('#datepicker').attr("value");
    if (date == "") {
        $('#datepicker').addClass("ui-state-error");
        return false;
    }
    op.date = date;
    console.debug("date:"+date);
    // from
    var from = $(ldc.view.form.id+' li.from select').val();
    op.from = from;
    console.debug("from:"+from);
    // to
    var to = $(ldc.view.form.id+' li.to select').val();
    op.to = to;
    console.debug("to:"+to);
    // cats
    op.cats = [];
    $(ldc.view.form.id+' li.cats .cats_elt').each( function() {
            var jThis = $(this);
            var cat_name = jThis.children(".name").val();
            var cat = ldc.categories.get_from_name(cat_name);
            if (cat == false) {
                jThis.children(".name").addClass('ui-state-error');
                return false;
            }
            var cat_value = jThis.children(".val").val();
            if (cat_value == "") {
                jThis.children(".val").addClass('ui-state-error');
                return false;
            }
            op.cats.push({id: cat.id, val:cat_value});
            console.debug(cat_name+'('+cat.id+'):'+cat_value);
    });
    //description
    op.description = $(ldc.view.form.id+' li.description textarea').val();

    /* Add operation server side */
    op.id = ldc.operations.add(op);
    $("#form").dialog('close');

    /* add operation client side */
    var total = 0;
    var html = '<ul>';
    for(var i in op.cats) {
        total += parseFloat(op.cats[i].val);
        var name = ldc.categories.get_name(op.cats[i].id);
        if (!name) {
            alert("Categorie "+op.cats[i].id+" not found!");
            return false;
        }
        html += '<li>'+name+' ('+op.cats[i].val+'€)</li>';
    }
    html += '</ul>';
    ldc.view.operations.table[op.from].fnAddData( [op.id, op.date, total, 0, html, op.description]);
    ldc.view.operations.table[op.to].fnAddData( [op.id, op.date, 0, total, html, op.description]);

    return false;
}




ldc.view.operations.html = function (op, compte_id) {
    var html = '<tr>';
    html += '<td>'+op.id+'</td>';
    html += '<td>'+op.date+'</td>';
    var total = 0;
    for(var i in op.cats) {
        total += parseFloat(op.cats[i].val);
    }
    if (compte_id == op.from) {
        html += '<td>'+total+'€</td><td>0€</td>';
    } else {
        html += '<td>0€</td><td>'+total+'€</td>';
    }
    // cats
    html += '<td><ul>';
    for(var i in op.cats) {
        var cat_name = ldc.categories.get_name(op.cats[i].id);
        if (!cat_name) {
            alert("Categorie "+op.cats[i].id+" not found!");
            return false;
        }
        html += '<li>'+cat_name+' ('+op.cats[i].val+'€)</li>';
    }
    html += '</ul></td>';
    html += '<td>'+op.description+'</td>'
    html += '</tr>';
    return html;
};




/******************************************************************************
  * Menu
******************************************************************************/
ldc.view.menu = function (css_id) {

    ldc.view.menu.id = css_id;

    $(css_id+" a.add-op").click(function () {
            ldc.view.all.hide();
            ldc.view.form.show();
            return false;
    });
    $(css_id+" a.comptes").click(function () {
            ldc.view.all.hide();
            ldc.view.comptes("div#comptes");
            return false;
    });
    $(css_id+" a.operations").click(function () {
            ldc.view.all.hide();
            ldc.view.operations("div#operations", 2);
            return false;
    });
    $(css_id+" a.stats").click(function () {
            ldc.view.all.hide();
            ldc.view.stats("#stats")
    });
    $(css_id+" a.cats").click(function () {
            ldc.view.all.hide();
            ldc.view.categories.show();
            return false;
    });

}


/******************************************************************************
  * CATEGORIES
******************************************************************************/
ldc.view.categories = function (css_id) {
    if (ldc.view.categories.is_init) {
        return false;
    }
    ldc.view.categories.id = css_id;
    ldc.view.categories.is_init = true;


    /* VIEW */
    function display_cat_r(cat, html) {
        html += '<li cat_id="'+cat.id+'"><a href="#"><ins>&nbsp;</ins>'+cat.name+'</a>';
        var children = ldc_cat_get_children(cat.id);
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
    var children = ldc.categories.get_children(0);
    for(var i in children) {
        html = display_cat_r(children[i], html);
    }
    html += '</ul></li></ul>';
    $(css_id+ " div.tree").append(html);

    $(css_id+ " div.tree").tree( {
        callback: {
            onrename : onrename_categories,
            ondelete : ondelete_categories,
            onmove   : onmove_categories
        },
        types: {
            "root" : {
                clickable   : true,
                deletable   : false,
                draggable   : false,
            }
        }
    });

    /* ACTIONS */
    var is_creation = false;
    var is_update = false;

    function onrename_categories(node) {
        var name = $(node).children("a").text().substr(1);
        var father_id = $(node).parent("ul").parent("li").attr("cat_id");
        if (is_creation) {
            var id = ldc.categories.add(name, father_id);
            $(node).attr("cat_id",id);
            is_creation = false;

        } else if (is_update) {
            var id =  $(node).attr("cat_id");
            ldc.categories.update(id, name, father_id);
            id_update = false;
        }
    }

    function ondelete_categories(node) {
        var id =  $(node).attr("cat_id");
        ldc.categories.del(id);
    }

    function onmove_categories(NODE,REF_NODE,TYPE,TREE_OBJ,RB) {
        var name = $(NODE).children("a").text().substr(1);
        var father_id = $(NODE).parent("ul").parent("li").attr("cat_id");
        var id =  $(NODE).attr("cat_id");
        ldc.categories.update(id, name, father_id);
    }

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


};

ldc.view.categories.is_init = false


ldc.view.categories.show = function () {
    $(ldc.view.categories.id).show();
}

ldc.view.categories.hide = function () {
    $(ldc.view.categories.id).hide();
}

/******************************************************************************
  * STATS
******************************************************************************/

ldc.view.stats = function (css_id) {
    ldc.view.stats.id = css_id;


    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');
    data.addRows(12);
    for (var i in ldc.MONTHS) {
        i = parseInt(i);
        data.setValue(i, 0, ldc.MONTHS[i].name);
    }
    var children = ldc.categories.get_children(0);
    for (var i in children) {
        data.addColumn('number', children[i].name);
    }
    for (var i in children) {
        for(var j in ldc.MONTHS) {
            var v = ldc.stats.get_all_cats(children[i].id, 2, '2010', ldc.MONTHS[j].num);
            data.setValue(parseInt(j), parseInt(i)+1, v);
        }
    }
    var chart = new google.visualization.ColumnChart(document.getElementById("stats"));
    chart.draw(data, {width: 600, height: 340, legend: 'bottom', title: 'Company Performance'});
    $(css_id).show();
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

ldc.view.form = function(css_id) {

    ldc.view.form.id = css_id;



    // complete HTML
    for(var i in ldc.COMPTES) {
        var name = ldc.COMPTES[i].bank + ' - ' + ldc.COMPTES[i].name;
        var id = ldc.COMPTES[i].id;
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
    $(ldc.view.form.id).dialog({ 
            modal: true,
            buttons: { "Ok": ldc.view.operations.add},
            autoOpen: false
    });
}


ldc.view.form.show = function (compte_id) {


    // init compte_id
    $(ldc.view.form.id+' input.compte_id').attr("value", compte_id);

    // init combo box from & to
    $(ldc.view.form.id+' li.from select option:selected').removeAttr('selected');
    $(ldc.view.form.id+' li.to select option:selected').removeAttr('selected');
    $(ldc.view.form.id+' li.from select option[value="'+compte_id+'"]').attr("selected", "selected");
    $(ldc.view.form.id+' li.to select option[value="0"]').attr("selected", "selected");
    $(ldc.view.form.id+' li.from select').attr("disabled", "true");
    $(ldc.view.form.id+' li.to select').removeAttr("disabled");

    // actions on debit credit
    $("#op-type1").unbind('click');
    $("#op-type1").click(function() {
        $(ldc.view.form.id+' li.from select option:selected').removeAttr('selected');
        $(ldc.view.form.id+' li.to select option:selected').removeAttr('selected');
        $(ldc.view.form.id+' li.from select option[value="'+compte_id+'"]').attr("selected", "selected");
        $(ldc.view.form.id+' li.to select option[value="0"]').attr("selected", "selected");
        $(ldc.view.form.id+' li.from select').attr("disabled", "true");
        $(ldc.view.form.id+' li.to select').removeAttr("disabled");
    });
    $("#op-type2").unbind('click');
    $("#op-type2").click(function() {
        $(ldc.view.form.id+' li.to select option:selected').removeAttr('selected');
        $(ldc.view.form.id+' li.from select option:selected').removeAttr('selected');
        $(ldc.view.form.id+' li.to select option[value="'+compte_id+'"]').attr("selected", "selected");
        $(ldc.view.form.id+' li.from select option[value="0"]').attr("selected", "selected");
        $(ldc.view.form.id+' li.to select').attr("disabled", "true");
        $(ldc.view.form.id+' li.from select').removeAttr("disabled");
    });

    // autocomplete categories
    var source = [];
    for (var i in ldc.CATEGORIES) {
        source.push(ldc.CATEGORIES[i].name);
    }
    $("li.cats input.name").autocomplete( {source: source});

    // add cat
    function del_cats() {
        $(this).parent().remove();
        return false;
    }
    function add_cats() {
        var html = '<div class="cats_elt">';
        html += '<input type="text" class="name"/>';
        html += '<input type="text" class="val"/>';
        html += '<button class="del">-</button>';
        html += '</div>';
        $(ldc.view.form.id+' li.cats .cats_list').append(html);
        $("li.cats input.name").autocomplete( {source: source});
        $(ldc.view.form.id+' li.cats button').button();
        $(ldc.view.form.id+' li.cats button.del').unbind('click');
        $(ldc.view.form.id+' li.cats button.del').click(del_cats);
        return false;
    }
    $(ldc.view.form.id+' li.cats button').button();
    $(ldc.view.form.id+' li.cats button.add').click(add_cats);
    $(ldc.view.form.id+' li.cats button.del').click(del_cats);
    

    $(ldc.view.form.id).dialog('open');
}

ldc.view.form.hide = function () {
    $(ldc.view.form.id).hide();
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
    for(var i in ldc.COMPTES) {
        var id = ldc.COMPTES[i].id;
        var banque = ldc.COMPTES[i].bank;
        var name = ldc.COMPTES[i].name;
        var solde_init = ldc.COMPTES[i].solde_init;
        var solde = ldc.comptes.get_solde(ldc.COMPTES[i].id);
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

