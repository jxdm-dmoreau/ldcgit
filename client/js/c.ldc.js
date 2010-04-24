ldc.c = {};


ldc.c.init = function () {

    ldc.v.menu.init($('#menu'));
    // tabs + liste des opérations
    for(var i in ldc.m.comptes.data) {
        var c = ldc.m.comptes.data[i];
        var id = "compte_"+c.id;
        var div = '<div class="operations" id="'+id+'"></div>';
        $("#tabs").append(div);
        var data2 = ldc.m.operations.getStats2(c.id, 2010, 2010, 01, 12);
        ldc.v.stats.init($("#"+id), "stats_"+c.id, data2, 'Mois', 'Dépenses', {axisFontSize:8});
        ldc.v.operations.init(id, c);
    }

    // init params
    ldc.v.params();
    ldc.v.form.init(ldc.c.operations.add,
        function() {
            ldc.v.form.cats.setSelected($(this));
            $(this).addClass("ui-state-highlight");
            ldc.v.popup.cats.open();
    });

    ldc.c.params();
    ldc.c.tabs();
    ldc.c.form();
    ldc.v.popup.cats.init(function(cat_id) {
            var c = ldc.m.categories.get(cat_id);
            ldc.v.form.cats.set('id', c.id);
            ldc.v.form.cats.set('name', c.name);
            ldc.v.form.cats.removeSelected();
            ldc.v.form.cats.removeError();
            ldc.v.popup.cats.close();
    });
}

ldc.c.pre_init = function () {
    ldc.m.init(ldc.c.init);
}

ldc.c.tabs = function() {

    // click on rows
    $("#tabs").delegate('tr', 'click', function() { 
            if ($(this).hasClass("ui-state-highlight")) {
                $(this).removeClass("ui-state-highlight");
                $(this).parents('div.operations').children("button.del").attr("disabled", "disabled");
                $(this).parents('div.operations').children("button.update").attr("disabled", "disabled");
                return false;
            }
            $(this).parents('div.operations').find(".ui-state-highlight").removeClass('ui-state-highlight');
            $(this).addClass('ui-state-highlight');
            $(this).parents('div.operations').children("button.del").removeAttr("disabled");
            $(this).parents('div.operations').children("button.update").removeAttr("disabled");
        });

    // add button
    $("#tabs button.add").click(function() {
        // init form
        ldc.v.form.compte_id.set($(this).attr('compte_id'));
        ldc.v.form.operation_id.set(-1);
        ldc.v.form.type.setChecked('debit');
        ldc.v.form.date.set('+0');
        ldc.v.form.from.set($(this).attr('compte_id'));
        ldc.v.form.from.disabled(true);
        ldc.v.form.to.set(0);
        ldc.v.form.to.disabled(false);
        ldc.v.form.cats.empty();
        ldc.v.form.cats.add();
        ldc.v.form.description.set('');
        ldc.v.form.open();
    });


    // del button
    $("#tabs button.del").click(function() {
        var id = $(this).parents('div.operations').find("tr.ui-state-highlight td:first").text();
        if (confirm("Voulez-vous supprimer l'opération "+id+"?")) {
            var op = ldc.m.operations.get(id);
            ldc.v.operations.del(op);
            ldc.m.operations.del(id);
            if (op.from != 0) {
                var data = ldc.m.operations.getStats2(op.from, 2010, 2010, 01, 12);
                ldc.v.stats.update("stats_"+op.from, data);
            }

            $(this).parents('div.operations').children("button.del").attr("disabled", "disabled");
            $(this).parents('div.operations').children("button.update").attr("disabled", "disabled");
        }
        return false;
    });

    // update button
    $("#tabs button.update").click(function() {
            var compte_id = $(this).attr('compte_id');
            var id = $(this).parents('div.operations').find("tr.ui-state-highlight td:first").text();
            var op = ldc.m.operations.get(id);
            ldc.v.form.compte_id.set(compte_id);
            ldc.v.form.operation_id.set(op.id);
            console.debug("from="+op.from);
            console.debug("to="+op.to);
            console.debug("compte="+compte_id);
            if (op.from == compte_id) {
                console.debug('debit detected')
                ldc.v.form.type.setChecked('debit');
                ldc.v.form.from.disabled(true);
                ldc.v.form.to.disabled(false);
            } else {
                console.debug('credit detected')
                ldc.v.form.type.setChecked('credit');
                ldc.v.form.from.disabled(false);
                ldc.v.form.to.disabled(true);
            }
            ldc.v.form.date.set(op.date);
            ldc.v.form.from.set(op.from);
            ldc.v.form.to.set(op.to);
            ldc.v.form.cats.empty();
            for (var i in op.cats) {
                var c = ldc.m.categories.get(op.cats[i].id);
                ldc.v.form.cats.add(c.id, c.name, op.cats[i].val);
            }
            ldc.v.form.description.set(op.description);
            ldc.v.form.open();
            return false;
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

    function del_cats() {
        $(this).parent().remove();
        return false;
    }
    $('#form li.cats button.add').click(function() {
            ldc.v.form.cats.add();
            return false;
    });
    /*
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
    */
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

ldc.c.operations.checkForm = function () {
    var error = false;
    /* construct op from form */
    var op = {};
    op.id = ldc.v.form.operation_id.get();
    // date
    ldc.v.form.date.removeError();
    var date = ldc.v.form.date.get();
    if (date == "") {
        ldc.v.form.date.setError();
        return false;
    }
    op.date = date;
    console.debug("date:"+date);
    // from
    var from = ldc.v.form.from.get();
    op.from = from;
    console.debug("from:"+from);
    // to
    var to = ldc.v.form.to.get();
    op.to = to;
    console.debug("to:"+to);
    // cats
    op.cats = [];
    $('#form li.cats ul li').each( function() {
            var jThis = $(this);
            var id = ldc.v.form.cats.get('id', jThis);
            if (id == -1) {
                ldc.v.form.cats.setError(jThis);
                error = true;
                return false;
            }
            var c = ldc.m.categories.get(id);
            var cat_value = ldc.v.form.cats.get('value', jThis);
            if (cat_value == "") {
                ldc.v.form.cats.setError(jThis);
                error = true;
                return false;
            }
            op.cats.push({id: c.id, val:cat_value});
            console.debug('('+c.id+'):'+cat_value);
    });
    if (error) {
        return false;
    }
    //description
    op.description = $('#form li.description textarea').val();
    return op;
}

ldc.c.operations.add = function () {

    var op = ldc.c.operations.checkForm();
    if (op == false) {
        return false;
    }

    if (op.id == -1) {
        /* Add operation server side */
        op.id = ldc.m.operations.add(op);
        ldc.v.operations.add(op);
        if (op.from != 0) {
            var data = ldc.m.operations.getStats2(op.from, 2010, 2010, 01, 12);
            ldc.v.stats.update("stats_"+op.from, data);
        }

        $("#form").dialog('close');
    } else {
        // update
        ldc.m.operations.update(op);
        ldc.v.operations.update(op);
        if (op.from != 0) {
            var data = ldc.m.operations.getStats2(op.from, 2010, 2010, 01, 12);
            ldc.v.stats.update("stats_"+op.from, data);
        }
        $("#form").dialog('close');
    }
    return false;
}

