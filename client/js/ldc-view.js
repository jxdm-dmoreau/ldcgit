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
var DTC;
function ldc_view_load_categories() {

    function categorie2html(cat) {
        var html = '<li><a href="#">'+cat.name+'<a></li>';
        return html;
    }

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

    var father_id_created = 0;
    function oncreate_categories(node, ref_node) {
        father_id_created = $(ref_node).attr("cat_id");
    }

    function onrename_categories(node) {
        var name = $(node).text().substr(1);
        id = ldc_cat_add(name, father_id_created);
        $(node).attr("cat_id",id);
    }
    function ondelete_categories(node) {
        var id =  $(node).attr("cat_id");
        ldc_cat_del(id);
    }


    html = '<ul>';
    var children = ldc_cat_get_children(0);
    for(var i in children) {
        html = display_cat_r(children[i], html);
    }
    html += '</ul>';
    $("#cats").append(html);
    $("div#cats_menu button.add").click(function() {
            var t = $.tree.focused();
            if(t.selected) {
                t.create();
            } else {
                alert("Select a node first");
            }
        }
    );
    $("div#cats_menu button.del").click(function() {
                $.tree.focused().remove();
        }
    );
    $.tree.defaults.callback.oncreate = oncreate_categories;
    $.tree.defaults.callback.onrename = onrename_categories;
    $.tree.defaults. callback.ondelete   = ondelete_categories;
    $("#cats").tree();


}
