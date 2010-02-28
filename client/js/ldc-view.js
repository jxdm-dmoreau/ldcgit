function register_listener () {
    $("#test").click(function() { alert(ldc_cat_get_children(1)); });
}
function ldc_view_init () {
    $("#main").hide();
    $("#log").empty().append('<div id="pb"></div>');
    $("#pb").css('width', '300px');
    $("#pb").progressbar({ value: 1 });
}

function ldc_load_completed() {
    ldc_view_load_operations();
    ldc_view_load_categories();
    $("#log").empty();
    $("#main").show();
}

function ldc_load(percent) {
    var length = percent * $("#pb").width();
    $("#pb").progressbar('option', 'value', length);
}

/******************************************************************************
  * LOG
******************************************************************************/
function ldc_view_log_error(text) {
    $("#log").empty().addClass('error').append(text);
}

function ldc_view_log_success(text) {
    $("#log").empty().addClass('success').append(text);
}

/******************************************************************************
  * Display operations
******************************************************************************/
function ldc_view_load_operations() {

    function operation2html(op, compte_id) {
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
    }

    for(var i in LDC_COMPTES) {
        var jDiv = $('<div>').append('<h1>'+LDC_COMPTES[i].bank+' - '+LDC_COMPTES[i].name+'</h1>');
        var jTable = $('<table>');
        var table_head = '<thead><th>id</th><th>date</th><th>Débit</th><th>Crédit</th><th>Catégories</th><th>Description</th></thead>';
        var jTable = $('<table>').append(table_head);
        var id = LDC_COMPTES[i].id;
        for (var j in LDC_OPERATIONS) {
            var from = LDC_OPERATIONS[j].from;
            var to =  LDC_OPERATIONS[j].to;
            if (from == id | to == id) {
                jTable.append(operation2html(LDC_OPERATIONS[j], i));
            }
        }
        jDiv.append(jTable);
        $("#operations").append(jDiv);
    }
}

/******************************************************************************
  * Display categories
******************************************************************************/
function ldc_view_load_categories() {

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

    var is_creation = false;
    var is_update = false;
    function onrename_categories(node) {
        var name = $(node).children("a").text().substr(1);
        var father_id = $(node).parent("ul").parent("li").attr("cat_id");
        if (is_creation) {
            var id = ldc_cat_add(name, father_id);
            $(node).attr("cat_id",id);
            is_creation = false;

        } else if (is_update) {
            var id =  $(node).attr("cat_id");
            console.debug("ldc_cat_update("+id+","+name+","+father_id+")");
            ldc_cat_update(id, name, father_id);
            id_update = false;
        }
    }
    function ondelete_categories(node) {
        var id =  $(node).attr("cat_id");
        ldc_cat_del(id);
    }
    function onmove_categories(NODE,REF_NODE,TYPE,TREE_OBJ,RB) {
        var name = $(NODE).children("a").text().substr(1);
        var father_id = $(NODE).parent("ul").parent("li").attr("cat_id");
        var id =  $(NODE).attr("cat_id");
        ldc_cat_update(id, name, father_id);
    }

    html = '<ul>';
    html += '<li rel="root" cat_id="0"><a href="#"><ins>&nbsp;</ins>Catégories</a><ul>';
    var children = ldc_cat_get_children(0);
    for(var i in children) {
        html = display_cat_r(children[i], html);
    }
    html += '</ul></li></ul>';
    $("#cats").append(html);

    /* buttons */
    $("div#cats_menu button.add").click(function() {
            is_creation = true;
            var t = $.tree.focused();
            if(t.selected) {
                t.create();
            } else {
                alert("Select a node first");
            }
        }
    );
    $("div#cats_menu button.del").click(function() {
        if(confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
                $.tree.focused().remove();
                }
        })
    ;
    $("div#cats_menu button.rename").click(function() {
                is_update = true;
                $.tree.focused().rename();
        })
    ;
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


}
