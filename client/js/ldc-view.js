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
    $(css_id).empty();
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'id');
    data.addColumn('string', 'Date');
    data.addColumn('string', 'Débit');
    data.addColumn('string', 'Crédit');
    data.addColumn('string', 'Catégories');
    data.addColumn('string', 'Description');
    data.addRows(6);


    var compte = ldc.comptes.get(compte_id);
    var line = 0;
    for (var j in ldc.OPERATIONS) {
        var op = ldc.OPERATIONS[j];
        var from = ldc.OPERATIONS[j].from;
        var to =  ldc.OPERATIONS[j].to;
        if (from != compte_id & to != compte_id) {
            continue;
        }
        for(var k in op.cats) {
            data.setCell(line, 0, op.id);
            data.setCell(line, 1, op.date);
            if (from == compte_id) {
                data.setCell(line, 2, op.cats[k].val);
                data.setCell(line, 3, '0');
            } else {
                data.setCell(line, 2, '0');
                data.setCell(line, 3, op.cats[k].val);
            }
            data.setCell(line, 4, ldc_cat_get_name(op.cats[k].cat_id));
            data.setCell(line, 5, op.description);
            line++;
        }
    }
    data.setTableProperty('page', 'enable');
    data.setTableProperty('pageSize', 2);
    var table = new google.visualization.Table(document.getElementById('operations_g'));
    table.draw(data, {showRowNumber: true});


    /* ACTIONS */
    /* function to add operation in the HTML table */
    function view_add_operation(op) {
        $("table[compte_id="+op.from+"]").css('color', 'red');
    }

    $(css_id+" button.add").click(function() {
            var op = { from:3, to:1, date:'2010-01-01', confirm:1, cats: { id:1, value:12}};
            //view_add_operation(op);
            ldc.operations.add(op);
    });
    $(css_id+" button.update").click(function() {
            var op = { id:46, from:2, to:3, date:'2010-01-01', confirm:1, cats: { id:1, value:12}};
            ldc.operations.update(op);
    });
    $(css_id+" button.del").click(function() {
            ldc.operations.del(45);
    });
    $(css_id).show();

}


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
            console.debug("ldc_cat_update("+id+","+name+","+father_id+")");
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
    if (ldc.view.form.is_init) {
        console.error("ldc.view.form allready init");
        return false;
    }

    ldc.view.form.id = css_id;
    ldc.view.form.is_init = true;

    for(var i in ldc.COMPTES) {
        $("div#form li.from select").append("<option>test<option>");
    }
}

ldc.view.form.is_init = false;

ldc.view.form.show = function () {
    $(ldc.view.form.id).show();
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

