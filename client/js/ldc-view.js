/******************************************************************************
  * VIEW
******************************************************************************/
ldc.view = function () {
    $("#main").hide();
    $("#log").empty().append('<div id="pb"></div>');
    $("#pb").css('width', '300px');
    $("#pb").progressbar({ value: 1 });
};




/******************************************************************************
  * LOAD
******************************************************************************/

ldc.view.load = function (percent) {
    var length = percent * $("#pb").width();
    $("#pb").progressbar('option', 'value', length);
};

ldc.view.load.completed = function () {
    ldc.view.operations.init();
    ldc.view.categories.init();
    $("#log").empty();
    $("#main").show();
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



/******************************************************************************
 * init
******************************************************************************/
ldc.view.operations = function (op, compte_id) {
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

ldc.view.operations.init = function() {

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
                jTable.append(ldc.view.operations(ldc.OPERATIONS[j], i));
            }
        }
        jDiv.append(jTable);
        $("#operations").append(jDiv);
    }

    /* ACTIONS */
    /* function to add operation in the HTML table */
    function view_add_operation(op) {
        $("table[compte_id="+op.from+"]").css('color', 'red');
    }

    $("div#operations button.add").click(function() {
            var op = { from:3, to:1, date:'2010-01-01', confirm:1, cats: { id:1, value:12}};
            //view_add_operation(op);
            ldc.operations.add(op);
    });
    $("div#operations button.update").click(function() {
            var op = { id:46, from:2, to:3, date:'2010-01-01', confirm:1, cats: { id:1, value:12}};
            ldc.operations.update(op);
    });
    $("div#operations button.del").click(function() {
            ldc.operations.del(45);
    });
};



/******************************************************************************
  * CATEGORIES
******************************************************************************/
ldc.view.categories = {};
ldc.view.categories.init = function () {

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
    $("#cats").append(html);

    $("#cats").tree( {
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

    $("div#cats_menu button.add").click(function() {
        is_creation = true;
        var t = $.tree.focused();
        if(t.selected) {
            t.create();
        } else {
            alert("Select a node first");
        }
    });

    $("div#cats_menu button.del").click(function() {
        if(confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
            $.tree.focused().remove();
        }
    });

    $("div#cats_menu button.rename").click(function() {
                is_update = true;
                $.tree.focused().rename();
    });

};
