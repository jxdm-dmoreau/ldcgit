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

function ldc_view_load_operations() {

    function operation2html(op) {
        var html = '<tr><td>'+op.id+'</td><td>'+op.description+'</td></tr>';
        return html;
    }

    var jTable = $('<table>').append('<tr><td>op_id</td><td></td></tr>');
    for(var i in LDC_COMPTES) {
        var id = LDC_COMPTES[i].id;
        for (var j in LDC_OPERATIONS) {
            var from = LDC_OPERATIONS[j].from;
            var to =  LDC_OPERATIONS[j].to;
            if (from == id | to == id) {
                console.debug("compte_id="+id+" op="+ LDC_OPERATIONS[j].id);
                jTable.append(operation2html(LDC_OPERATIONS[j]));
            }
        }
    }
    $("#main").append(jTable);
}

