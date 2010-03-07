/******************************************************************************
  * VIEW
******************************************************************************/

ldc.view = function () {
    $("#log").empty();
    ldc.view.all.hide();
    ldc.view.menu();
    ldc.view.form("div#form");
    ldc.view.categories("div#cats");
    ldc.view.stats("div#stats");
    ldc.view.categories("div#cats");
    ldc.view.comptes("div#comptes");
    ldc.view.operations("div#operations");
    $("#main").show();
};

/******************************************************************************
  * all
******************************************************************************/
ldc.view.all = {};

ldc.view.all.hide = function () {
    ldc.log("ldc.view.all.hide()");
    ldc.view.form.hide();
    ldc.view.categories.hide();
    ldc.view.comptes.hide();
    ldc.view.operations.hide();
    ldc.view.categories.hide();
    ldc.view.stats.hide();
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
    $("#pb").progressbar('option', 'value', length);
};

ldc.view.load.completed = function () {
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


ldc.view.operations = function(css_id) {

    if (ldc.view.operations.is_init) {
        console.error("operations allready init");
        return false;
    }
    ldc.view.operations.id = css_id;
    ldc.view.operations.is_init = true;

    /* VIEW */
    for(var i in ldc.COMPTES) {
        var jDiv = $('<div>').append('<h1>'+ldc.COMPTES[i].bank+' - '+ldc.COMPTES[i].name+'</h1>');
        var jTable = $('<table compte_id="'+ldc.COMPTES[i].id+'">');
        var table_head = '<thead><th>id</th><th>date</th><th>Débit</th><th>Crédit</th><th>Catégories</th><th>Description</th></thead>';
        jTable.append(table_head);
        var id = ldc.COMPTES[i].id;
        for (var j in ldc.OPERATIONS) {
            var from = ldc.OPERATIONS[j].from;
            var to =  ldc.OPERATIONS[j].to;
            if (from == id | to == id) {
                jTable.append(ldc.view.operations.html(ldc.OPERATIONS[j], i));
            }
        }
        jDiv.append(jTable);
        $(css_id).append(jDiv);
    }

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

};

ldc.view.operations.is_init = false;

ldc.view.operations.show = function () {
    $(ldc.view.operations.id).show();
}

ldc.view.operations.hide = function () {
    $(ldc.view.operations.id).hide();
}


ldc.view.operations.html = function (op, compte_id) {
    var html = '<tr>';
    html += '<td>'+op.id+'</td>';
    html += '<td>'+op.date+'</td>';
    if (compte_id == op.from) {
        html += '<td>';
        html += '<ul>';
        for(i in op.cats) {
            html += '<li>'+op.cats[i].val+'</li>';
        }
        html += '</ul>';
        html += '</td>'
        html += '<td>0</td>';
    } else {
        html += '<td>0</td>';
        html += '<td><ul>';
        for(i in op.cats) {
            html += '<li>'+op.cats[i].val+'</li>';
        }
        html += '</ul></td>';
    }
    html += '<td><ul>';
    for(i in op.cats) {
        html += '<li>'+ldc_cat_get_name(op.cats[i].cat_id)+'</li>';
    }
    html += '</ul></td>';
    html += '<td>'+op.description+'</td>'
    html += '</tr>';
    return html;
};




/******************************************************************************
  * Menu
******************************************************************************/
ldc.view.menu = function () {
    $("div#menu a.add-op").click(function () {
            ldc.view.all.hide();
            ldc.view.form.show();
            return false;
    });
    $("div#menu a.comptes").click(function () {
            ldc.view.all.hide();
            ldc.view.comptes.show();
            return false;
    });
    $("div#menu a.operations").click(function () {
            ldc.view.all.hide();
            ldc.view.operations.show();
            return false;
    });
    $("div#menu a.stats").click(function () {
            ldc.view.all.hide();
            ldc.view.stats.show()
    });
    $("div#menu a.cats").click(function () {
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
    console.debug("ldc.view.stats()");;
    ldc.view.stats.id = css_id;
}

ldc.view.stats.show = function () {
    $(ldc.view.stats.id).show();
}

ldc.view.stats.hide = function () {
    $(ldc.view.stats.id).hide();
}




ldc.drawChart = function () {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');
    data.addColumn('number', 'Débit');
    var d= [ ["2009-01-01", 1], ['2009-01-02',2]];
    data.addRows(d);

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, {width: 600, height: 340, legend: 'bottom', title: 'Company Performance'});
    $("#chart_div").resizable();

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
    ldc.view.comptes.id = css_id;
}


ldc.view.comptes.show = function () {
    $(ldc.view.comptes.id).show();
}

ldc.view.comptes.hide = function () {
    $(ldc.view.comptes.id).hide();
}
