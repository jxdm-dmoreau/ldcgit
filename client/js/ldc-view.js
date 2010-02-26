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
                console.debug("compte_id="+id+" op="+ LDC_OPERATIONS[j].id);
                jTable.append(operation2html(LDC_OPERATIONS[j], i));
            }
        }
        jDiv.append(jTable);
        $("#main").append(jDiv);
    }
}

/******************************************************************************
  * Display categories
******************************************************************************/
