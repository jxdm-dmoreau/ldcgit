ldc.c = {};


ldc.c.init = function () {
    ldc.c.init.model();
}

ldc.c.init.model = function ()
{
    console.debug("ldc.c.init.modele()");
    ldc.m.init(ldc.v.init);
    return false;
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
