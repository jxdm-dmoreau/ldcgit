ldc.c = {};



ldc.c.init = function () {
    ldc.c.params();
    ldc.c.tabs();
    ldc.c.form();

}

ldc.c.tabs = function() {

    // add button
    $("#tabs button.add").click(function() {
        // add compte_id in form
        var compte_id = $(this).attr('compte_id');
        $('#form input.compte_id').attr("value", compte_id);
        $('#form li.from select option:selected').removeAttr('selected');
        $('#form li.to select option:selected').removeAttr('selected');
        $('#form li.from select option[value="'+compte_id+'"]').attr("selected", "selected");
        $('#form li.to select option[value="0"]').attr("selected", "selected");
        $('#form li.from select').attr("disabled", "true");
        $('#form li.to select').removeAttr("disabled");
        $("#form").dialog('open');
    });
    return false;
}




ldc.c.form = function() {
    // actions on debit credit
    $("#op-type1").unbind('click');
    $("#op-type1").click(function() {
        var compte_id = $('#form input.compte_id').attr("value");
        $('#form li.from select option:selected').removeAttr('selected');
        $('#form li.to select option:selected').removeAttr('selected');
        $('#form li.from select option[value="'+compte_id+'"]').attr("selected", "selected");
        $('#form li.to select option[value="0"]').attr("selected", "selected");
        $('#form li.from select').attr("disabled", "true");
        $('#form li.to select').removeAttr("disabled");
    });
    $("#op-type2").unbind('click');
    $("#op-type2").click(function() {
        var compte_id = $('#form input.compte_id').attr("value");
        $('#form li.to select option:selected').removeAttr('selected');
        $('#form li.from select option:selected').removeAttr('selected');
        $('#form li.to select option[value="'+compte_id+'"]').attr("selected", "selected");
        $('#form li.from select option[value="0"]').attr("selected", "selected");
        $('#form li.to select').attr("disabled", "true");
        $('#form li.from select').removeAttr("disabled");
    });

    // autocomplete categories
    var source = [];
    for (var i in ldc.m.categories.data) {
        source.push(ldc.m.categories.data[i].name);
    }
    $("#form li.cats input.name").autocomplete( {source: source});
    // button
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
        $('#form li.cats .cats_list').append(html);
        $("li.cats input.name").autocomplete( {source: source});
        $('#form li.cats button').button();
        $('#form li.cats button.del').unbind('click');
        $('#form li.cats button.del').click(del_cats);
        return false;
    }
    $('#form li.cats button').button();
    $('#form li.cats button.add').click(add_cats);
    $('#form li.cats button.del').click(del_cats);
    return false;
}


ldc.c.params = function () {
    // cats
    $("#params li.cats button.add").click(function() {
        var t = $.tree.focused();
        if(t.selected) {
            ldc.c.params.is_creation = true;
            t.create();
        } else {
            alert("Select a node first");
        }
    });

    $("#params li.cats button.del").click(function() {
        if(confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
            $.tree.focused().remove();
        }
    });

    $("#params li.cats button.rename").click(function() {
        var t = $.tree.focused();
        if(t.selected) {
            ldc.c.params.is_update = true;
            t.rename();
        } else {
            alert("Select a node first");
        }
    });

    $("#submenu a[href=#params]").click(function() {
            $("#params").dialog('open');
    });
}

ldc.c.params.is_creation = false;
ldc.c.params.is_update = false;

ldc.c.params.onrename_categories = function(node) {
    var name = $(node).children("a").text().substr(1);
    var father_id = $(node).parent("ul").parent("li").attr("cat_id");
    if (ldc.c.params.is_creation) {
        var id = ldc.m.categories.add(name, father_id);
        $(node).attr("cat_id",id);
        ldc.c.params.is_creation = false;

    } else if (ldc.c.params.is_update) {
        var id =  $(node).attr("cat_id");
        ldc.m.categories.update(id, name, father_id);
        ldc.c.params.is_update = false;
    }
}

ldc.c.params.ondelete_categories = function(node) {
    var id =  $(node).attr("cat_id");
    ldc.m.categories.del(id);
}

ldc.c.params.onmove_categories = function(NODE,REF_NODE,TYPE,TREE_OBJ,RB) {
    var name = $(NODE).children("a").text().substr(1);
    var father_id = $(NODE).parent("ul").parent("li").attr("cat_id");
    var id =  $(NODE).attr("cat_id");
    ldc.m.categories.update(id, name, father_id);
}

ldc.c.operations = {};

ldc.c.operations.add = function () {

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
