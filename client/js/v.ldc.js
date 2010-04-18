/******************************************************************************
  * VIEW
******************************************************************************/
ldc.v = {};


ldc.v.init = function ()
{
    // tabs + liste des opérations
    for(var i in ldc.m.comptes.data) {
        var c = ldc.m.comptes.data[i];
        var id = "compte_"+c.id;
        $("#tabs ul.tabs").append('<li><a href="#compte_'+c.id+'">'+c.name+'</a></li>');
        var div = '<div class="operations" id="'+id+'"></div>';
        $("#tabs").append(div);
        var data = ldc.m.operations.getStats(2, 2009, 2010, 01, 12);
        ldc.v.stats.init($("#"+id), "stats_"+c.id, data);
        ldc.v.operations.init(id, c, data);
    }
    $("#tabs").tabs();

    // init params
    ldc.v.params();

    // init form
    //ldc.v.form.init(ldc.c.operations.add);

    // timeline
    ldc.v.timeline();


    return false;
}



/******************************************************************************
  * log
******************************************************************************/
ldc.v.log = function (text) {
    $("#log").empty().append(text);
}

ldc.v.log.success = ldc.v.log;
ldc.v.log.error = ldc.v.log;


/******************* operations MODULE ***************************************/
ldc.v.operations = {};



ldc.v.operations.table = [];


ldc.v.operations.init = function (id, compte) {

    /* Functions */

    function total(op) {
        var total = 0;
        for(var i in op.cats) {
            total += parseFloat(op.cats[i].val);
        }
        return total;
    }

    function cats2html(op) {
        var html = '<ul>';
        for(var i in op.cats) {
            var cat = ldc.m.categories.get(op.cats[i].id);
            html += '<li>'+cat.name+' ('+op.cats[i].val+'€)</li>';
        }
        html += '</ul>';
        return html;
    }

    function add(op) {
        var t = total(op);
        var html = cats2html(op);
        if (op.from != 0) {
            ldc.v.operations.table[op.from].fnAddData( [op.id, op.date, t, 0, html, op.description]);
        }
        if (op.to != 0) {
            ldc.v.operations.table[op.to].fnAddData( [op.id, op.date, 0, t, html, op.description]);
        }

        return false;
    }

     function update(op) {
        var t = total(op);
        var html = cats2html(op);
        if (op.from != 0) {
            var jTr = $("#compte_"+op.from+" tr td.op-id:contains('"+op.id+"')").parents("tr");
            var ret = ldc.v.operations.table[op.from].fnUpdate( [op.id, op.date, t, 0, html, op.description], jTr[0]);
        }
        if (op.to != 0) {
            var jTr = $("#compte_"+op.to+" tr td.op-id:contains('"+op.id+"')").parents("tr");
            var ret = ldc.v.operations.table[op.to].fnUpdate( [op.id, op.date, 0, t, html, op.description], jTr[0]);
        }
        return false;
    }

    function del(op) {
        if (op.from != 0) {
            var jTr = $("#compte_"+op.from+" tr td.op-id:contains('"+op.id+"')").parents("tr");
            ldc.v.operations.table[op.from].fnDeleteRow(jTr[0]);
        }
        if (op.to != 0) {
            var jTr = $("#compte_"+op.to+" tr td.op-id:contains('"+op.id+"')").parents("tr");
            ldc.v.operations.table[op.to].fnDeleteRow(jTr[0]);
        }
        return false;
    }

    function op2html(op, compte) {
        var html = '<tr>';
        html += '<td class="op-id">'+op.id+'</td>';
        html += '<td>'+op.date+'</td>';
        var total = 0;
        for(var i in op.cats) {
            total += parseFloat(op.cats[i].val);
        }
        if (compte.id == op.from) {
            html += '<td>'+total+'€</td><td>0€</td>';
        } else {
            html += '<td>0€</td><td>'+total+'€</td>';
        }
        // cats
        html += '<td>';
        html += cats2html(op);
        html += '</td>';
        html += '<td>'+op.description+'</td>'
        html += '</tr>';
        return html;
    }

    /* generate html */
    var html = '<button compte_id="'+compte.id+'" class="add">Ajouter</button>';
    html += '<button compte_id="'+compte.id+'" class="update" disabled="disabled">Modifier</button>';
    html += '<button compte_id="'+compte.id+'" class="del" disabled="disabled">Supprimer</button>';
    html += '<table compte_id="'+compte.id+'" class="operations-table">';
    html += '<thead><tr><th>id</th><th>date</th><th>Débit</th><th>Crédit</th><th>Catégories</th><th>Description</th></tr></thead><tbody>';
    var ops = ldc.m.operations.getAll();
    for (var j in ops) {
        var from = ops[j].from;
        var to =  ops[j].to;
        if (from == compte.id | to == compte.id) {
            html += op2html(ops[j], compte);
        }
    }
    html += '</tbody>';
    /* add to the the div */
    $("#"+id).append(html);
    /* generate the dataTable */
    var dataTable = $("#"+id+" table").dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers"
    });
    /* store the dataTable object (needed to add new values ...) */
    ldc.v.operations.table[compte.id] = dataTable;



    /* register public functions */
    ldc.v.operations.add    = add;
    ldc.v.operations.update = update;
    ldc.v.operations.del    = del;

}


/******************************************************************************
  * categories
******************************************************************************/
ldc.v.categories = {};
ldc.v.categories.init = function (jContainer, id) {

    var div = '<div class="categories" id="'+id+'"></div>';
    jContainer.append(div);
    jDiv = $("#"+id);

    function display_cat_r(cat, html) {
        html += '<li cat_id="'+cat.id+'"><a href="#"><ins>&nbsp;</ins>'+cat.name+'</a>';
        var children = ldc.m.categories.get_children(cat.id);
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
    var children = ldc.m.categories.get_children(0);
    for(var i in children) {
        html = display_cat_r(children[i], html);
    }
    html += '</ul></li></ul>';
    jDiv.append(html);

    $("#"+id).tree( {
        callback: {
            onrename : ldc.c.params.onrename_categories,
            ondelete : ldc.c.params.ondelete_categories,
            onmove   : ldc.c.params.onmove_categories
        },
        types: {
            "root" : {
                clickable   : true,
                deletable   : false,
                draggable   : false,
            }
        }
    });


};




/******************************************************************************
  * STATS
******************************************************************************/

/*

 */
ldc.v.stats = function () {

    var charts = new Array();

    function show(id) {
        $("#"+id).show();

    }

    function hide(id) {
        $("#"+id).hide();
    }

    function update(id, data) {
        var gData = new google.visualization.DataTable();
        gData.addColumn('string', 'Date');
        gData.addColumn('number', 'Dépenses');
        for(var i in data) {
            gData.addRow(data[i]);
        }
        var chart = charts[id];
        chart.draw(gData, {width: 800, height: 250, legend: 'bottom', title: "toto"});
    }

    function init(jContainer, id, data) {
        var gData = new google.visualization.DataTable();
        gData.addColumn('string', 'Date');
        gData.addColumn('number', 'Dépenses');
        for(var i in data) {
            gData.addRow(data[i]);
        }
        var html = '<div id="'+id+'"></div>';
        jContainer.append(html);
        var chart = new google.visualization.LineChart(document.getElementById(id));
        charts[id] = chart;
        chart.draw(gData, {width: 800, height: 250, legend: 'bottom', title: "toto"});
    }


    ldc.v.stats.show = show;
    ldc.v.stats.hide = hide;
    ldc.v.stats.update = update;
    ldc.v.stats.init = init;
}

ldc.v.stats();






/******************************************************************************
  * Formulaire
******************************************************************************/
ldc.v.form = {};

ldc.v.form.init = function(onValidate, onCatNameClick) {
    /* Functions */

    /* type */
    ldc.v.form.type = function() {
        function setChecked(type) {
            if (type == 'debit') {
                $("#form li.type input#op-type1").attr("checked", "checked");
                $("#form li.type input#op-type2").removeAttr("checked");
            }
            if (type == 'credit') {
                $("#form li.type input#op-type2").attr("checked", "checked");
                $("#form li.type input#op-type1").removeAttr("checked");
            }
            $("#form li.type input#op-type1").button('refresh');
            $("#form li.type input#op-type2").button('refresh');
        }
        ldc.v.form.type.setChecked = setChecked;
    }

    ldc.v.form.type();


    /* cats */
    ldc.v.form.cats = function() {

        function add(id, name, val) {
            id = (id==undefined)?-1:id;
            name = (name==undefined)?'':name;
            val = (val==undefined)?0:val;
            var html = '<li>';
            html += '<input type=hidden class="id" value="'+id+'" />';
            html += '<input type="text" class="name" value="'+name+'"/>';
            html += '<input type="text" class="val" value="'+val+'"/>';
            html += '<button class="del">-</button>';
            html += '</li>';
            $("#form li.cats ul").append(html);
        }

        function empty() {
            $("#form li.cats ul").empty();
        }

        function set(name, value) {
            if (name == 'id') {
                $("#form li.cats input.ui-state-highlight").parent().children('input.id').val(value);
            }
            if (name == 'name') {
                $("#form li.cats input.ui-state-highlight").parent().children('input.name').val(value);
            }
            if (name == 'val') {
                $("#form li.cats input.ui-state-highlight").parent().children('input.val').val(value);
            }
        }
        function setSelected(jThis) {
            jThis.addClass("ui-state-highlight");
        }
        function removeSelected(jThis) {
            $("#form .ui-state-highlight").removeClass("ui-state-highlight");
        }
        function get(name, jThis) {
            if (name == 'id') {
                return jThis.children('.id').val();
            }
            if (name == 'name') {
                return jThis.children('.name').val();
            }
            if (name == 'value') {
                return jThis.children('.val').val();
            }
        }
        function setError(jThis) {
            jThis.addClass('ui-state-error');
        }
        function removeError() {
            $('#form li.cats .ui-state-error').removeClass('ui-state-error');
        }
        function del() {
            $(this).parent().remove();
        }

        ldc.v.form.cats.add = add; 
        ldc.v.form.cats.get = get; 
        ldc.v.form.cats.del = del; 
        ldc.v.form.cats.set = set;
        ldc.v.form.cats.empty = empty;
        ldc.v.form.cats.removeError = removeError; 
        ldc.v.form.cats.setError = setError; 
        ldc.v.form.cats.setSelected = setSelected;
        ldc.v.form.cats.removeSelected = removeSelected;
    }

    ldc.v.form.date = function() {
        function set(date) {
            $("#form #datepicker").datepicker('setDate', date);
        }
        function get(date) {
            return $("#form #datepicker").val();
        }
        function setError() {
            $('#datepicker').addClass("ui-state-error");
        }
        function removeError() {
            $('#datepicker').removeClass("ui-state-error");
        }
        ldc.v.form.date.removeError = removeError;
        ldc.v.form.date.setError = setError;
        ldc.v.form.date.get = get; 
        ldc.v.form.date.set = set;
    }

    ldc.v.form.to = function () {
        function set(to) {
            $('#form li.to select option:selected').removeAttr('selected');
            $('#form li.to select option[value="'+to+'"]').attr("selected", "selected");
        }
        function get() {
            return $('#form li.to select').val();
        }
        function disabled(bool) {
            if (bool == true) {
                $('#form li.to select').attr('disabled', 'disabled');
            } else {
                $('#form li.to select').removeAttr('disabled');
            }
        }
        ldc.v.form.to.set = set; 
        ldc.v.form.to.disabled = disabled; 
        ldc.v.form.to.get = get; 
    }

    ldc.v.form.from = function() {
        function set(from) {
            $('#form li.from select option:selected').removeAttr('selected');
            $('#form li.from select option[value="'+from+'"]').attr("selected", "selected");
        }
        function get() {
            return $('#form li.from select').val();
        }
        function disabled(bool) {
            if (bool == true) {
                $('#form li.from select').attr('disabled', 'disabled');
            } else {
                $('#form li.from select').removeAttr('disabled');
            }
        }
        ldc.v.form.from.disabled = disabled; 
        ldc.v.form.from.set = set;
        ldc.v.form.from.get = get;
    };

    ldc.v.form.compte_id = function() {
        function set(id) {
            $('#form input.compte_id').val(id);
        }
        function get() {
            return $('#form input.compte_id').val();
        }
        ldc.v.form.compte_id.set = set;
        ldc.v.form.compte_id.get = get;
    }

    ldc.v.form.operation_id = function() {
        function set(id) {
            $('#form input.operation_id').val(id);
        }
        function get() {
            return $('#form input.operation_id').val();
        }
        ldc.v.form.operation_id.get = get; 
        ldc.v.form.operation_id.set = set;
    }

    ldc.v.form.description = function () {
        function set(text) {
            $("#form li.description textarea").val(text);
        }
        function get () {
            return $("#form li.description textarea").val();
        }
        ldc.v.form.description.get = get; 
        ldc.v.form.description.set = set;
    }

    ldc.v.form.cats();
    ldc.v.form.date();
    ldc.v.form.to();
    ldc.v.form.from();
    ldc.v.form.compte_id();
    ldc.v.form.operation_id();
    ldc.v.form.description();

    function open() {
        $("#form").dialog('open');
    }

    // complete HTML
    for(var i in ldc.m.comptes.data) {
        var name = ldc.m.comptes.data[i].bank + ' - ' + ldc.m.comptes.data[i].name;
        var id = ldc.m.comptes.data[i].id;
        $("div#form li.from select").append('<option value="'+id+'">'+name+'</option>');
        $("div#form li.to select").append('<option value="'+id+'">'+name+'</option>');
    }
    $("div#form li.to select").append('<option value="0">Extérieur</option>');
    $("div#form li.from select").append('<option value="0">Extérieur</option>');


    $("#form li.cats").delegate('input.name', 'click', onCatNameClick);
    $("#form li.cats").delegate('button.del', 'click', ldc.v.form.cats.del);

    // datepicker
    $("#datepicker").datepicker({ dateFormat: 'yy-mm-dd' });
    // radios
    $("#type").buttonset();
    // dialog
    $("#form").dialog({ 
            modal: true,
            buttons: { "Ok": onValidate},
            autoOpen: false,
            draggable: false,
            title: 'Opérations',
            width: 500,
            resizable: false
    });

    ldc.v.form.open = open;
}




/* POPUP cats */

ldc.v.popup = {};
ldc.v.popup.cats = {};
ldc.v.popup.cats.id = 'popup_cats';

ldc.v.popup.cats.init = function (onSelect) {

    function select(NODE, TREE_OBJ) {
        var cat_id = $(NODE).attr('cat_id');
        onSelect(cat_id);
        return false;
    }

    function display_cat_r(cat, html) {
        html += '<li cat_id="'+cat.id+'"><a href="#"><ins>&nbsp;</ins>'+cat.name+'</a>';
        var children = ldc.m.categories.get_children(cat.id);
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
    var children = ldc.m.categories.get_children(0);
    for(var i in children) {
        html = display_cat_r(children[i], html);
    }
    html += '</ul></li></ul>';
    var jDiv = $('<div id="'+ldc.v.popup.cats.id+'">');
    jDiv.append(html);

    jDiv.tree( {
        callback: {
            onselect : select
        },
        types: {
            "root" : {
                clickable   : true,
                deletable   : false,
                draggable   : false,
            }
        }
    });
    $("body").append(jDiv);
    jDiv.dialog({
            modal: true,
            autoOpen: false,
            draggable: false,
            resizable: false,
            title: 'Choix catégorie',
            width: 500
    });

}

ldc.v.popup.cats.open = function () {

    $('#'+ldc.v.popup.cats.id).dialog('open');
}

ldc.v.popup.cats.close = function () {
    $('#'+ldc.v.popup.cats.id).dialog('close');
}

/******************************************************************************
  * Parameters
******************************************************************************/

ldc.v.params = function() {
    ldc.v.categories.init($("#params li.cats"), "cats");
    $("#params").dialog({
            buttons: { "Fermer": function() { $("#params").dialog('close');}},
            modal: true,
            autoOpen: false,
            draggable: false,
            resizable: false,
            title: 'Paramères',
            width: 500,
            hide: 'slide',
            closeText: 'hide'
    });
}




/******************************************************************************
  * Comptes
******************************************************************************/

ldc.v.comptes = function(css_id) {
    $(css_id).hide();
    $(css_id).empty();
    var table = '<table><thead><th>id</th><th>Banque</th><th>Nom</th><th>Solde initial</th><th>Solde Courant</th></thead>';
    for(var i in ldc.m.COMPTES) {
        var id = ldc.m.COMPTES[i].id;
        var banque = ldc.m.COMPTES[i].bank;
        var name = ldc.m.COMPTES[i].name;
        var solde_init = ldc.m.COMPTES[i].solde_init;
        var solde = ldc.m.COMPTES.get_solde(ldc.m.COMPTES[i].id);
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


ldc.v.timeline = function() {
    $("#timeline").slider({
            range: true,
            animate: true,
    });
}

ldc.v.alert = function() {
    alert("alert");
}
