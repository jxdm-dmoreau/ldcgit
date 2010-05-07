/******************************************************************************
  * VIEW
******************************************************************************/
ldc.v = {};



ldc.v.init = function () {
    // tabs + liste des opérations
    for(var i in ldc.m.comptes.data) {
        var c = ldc.m.comptes.data[i];
        $("#tabs ul.top").append('<li><a href="#compte_'+c.id+'">'+c.bank+'-'+c.name+'</a></li>');
        ldc.v.operations.init(c);
    }
    $("#tabs button.add").click(ldc.c.tabs.add);
    $("#tabs button.update").click(ldc.c.tabs.update);
    $("#tabs button.del").click(ldc.c.tabs.del);
    $("#tabs ul.top").append('<li><a href="#tab-stats">Statistiques</a></li>');
    ldc.v.tabStats.init();
    $("#tabs").tabs();


    // init params
    ldc.v.params();
    ldc.v.form.init();
    ldc.v.popup.cats.init();
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





ldc.v.operations = function (id, compte) {

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
            var tr;
            $("#compte_"+op.from+" tr").each(function(index, Element) {if ($(Element).children('td').first().text()==op.id) { tr = Element;}});
            return false;
            var ret = ldc.v.operations.table[op.from].fnUpdate( [op.id, op.date, t, 0, html, op.description], tr);
        }
        if (op.to != 0) {
            var tr;
            $("#compte_"+op.to+" tr").each(function(index, Element) {if ($(Element).children('td').first().text()==op.id) { tr = Element;}});
            var ret = ldc.v.operations.table[op.to].fnUpdate( [op.id, op.date, 0, t, html, op.description], tr);
        }
        return false;
    }

    function del(op) {
        if (op.from != 0) {
            var tr;
            $("#compte_"+op.from+" tr").each(function(index, Element) {if ($(Element).children('td').first().text()==op.id) { tr = Element;}});
            ldc.v.operations.table[op.from].fnDeleteRow(tr);
        }
        if (op.to != 0) {
            var tr;
            $("#compte_"+op.to+" tr").each(function(index, Element) {if ($(Element).children('td').first().text()==op.id) { tr = Element;}});
            ldc.v.operations.table[op.to].fnDeleteRow(tr);
        }
        return false;
    }

    function op2html(op, compte) {
        var html = '<tr>';
        html += '<td>'+op.id+'</td>';
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

    init = function(compte) {
        var id = "compte_"+compte.id;
        var div = '<div class="operations" id="'+id+'"></div>';
        $("#tabs").append(div);
        /* stats */
        var data2 = ldc.m.stats.getDebit(compte.id, 2010, 2010, 01, 12);
        ldc.v.stats.init($("#"+id), "stats_"+compte.id, data2, 'Mois', 'Dépenses', {axisFontSize:8});
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
        $("#"+id+" button").button();
        /* actions */
        $("#tabs #"+id).delegate('tr', 'click', ldc.c.tabs.onClickTr); 

        /* store the dataTable object (needed to add new values ...) */
        ldc.v.operations.table[compte.id] = dataTable;
    }



    /* register public functions */
    ldc.v.operations.add    = add;
    ldc.v.operations.update = update;
    ldc.v.operations.del    = del;
    ldc.v.operations.init   = init;
    ldc.v.operations.table = [];

}

ldc.v.operations();
/******************************************************************************
  * categories
******************************************************************************/
ldc.v.categories = {};

ldc.v.categories.init = function (jContainer, id) {

        var callbacks = {
            onrename : ldc.c.params.onrename_categories,
            ondelete : ldc.c.params.ondelete_categories,
            onmove   : ldc.c.params.onmove_categories
        };
        ldc.v.categories.tree(jContainer, id, callbacks);
};

ldc.v.categories.tree = function (jContainer, id, callbacks)  {

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
        callback: callbacks,
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
        gData.addColumn('string', charts[id].xTitle);
        gData.addColumn('number', charts[id].yTitle);
        for(var i in data) {
            gData.addRow(data[i]);
        }
        charts[id].chart.draw(gData, charts[id].options);
    }

    function init(jContainer, id, data, xTitle, yTitle, options) {
        var gData = new google.visualization.DataTable();
        gData.addColumn('string', xTitle);
        gData.addColumn('number', yTitle);
        for(var i in data) {
            gData.addRow(data[i]);
        }
        var html = '<div id="'+id+'"></div>';
        jContainer.append(html);
        var chart = new google.visualization.LineChart(document.getElementById(id));
        /* default value */
        if (options.width == undefined) {
            options.width = 700;
        }
        if (options.height == undefined) {
            options.height = 150;
        }
        if (options.legend == undefined) {
            options.legend = 'none';
        }
        /* store parameters */
        charts[id] = {};
        charts[id].chart = chart;
        charts[id].options = options;
        charts[id].xTitle = xTitle;
        charts[id].yTitle = yTitle;
        /* draw */
        chart.draw(gData, options);
    }


    ldc.v.stats.show = show;
    ldc.v.stats.hide = hide;
    ldc.v.stats.update = update;
    ldc.v.stats.init = init;
}

ldc.v.stats();


/******************************************************************************
  * TAB STATS
******************************************************************************/

ldc.v.tabStats = {};
ldc.v.tabStats.catId = 0;
ldc.v.tabStats.nbYear = 1;

/* init */
ldc.v.tabStats.init = function () {
    var html = '<div id="tab-stats"><div>';
    $("#tabs").append(html);


    var data = ldc.m.stats.getTotal(ldc.m.date.year-ldc.v.tabStats.nbYear, ldc.m.date.month, ldc.m.date.year, ldc.m.date.month);
    ldc.v.tabStats.line.init('total-stats', data, 'Mois', 'Total', {title: 'Total (€)'});

    ldc.v.tabStats.slider();

    function select(NODE, TREE_OBJ) {
        ldc.v.tabStats.catId = $(NODE).attr('cat_id');
        ldc.v.tabStats.update();
        return false;
    }

    var callbacks = { onselect : select };
    ldc.v.categories.tree($("#tab-stats"), 'tab-stats-cat-tree', callbacks);

    var data = ldc.m.stats.getCatChildren(
            ldc.v.tabStats.catId ,
            'debit',
            ldc.m.date.year-ldc.v.tabStats.nbYear,
            ldc.m.date.month,
            ldc.m.date.year,
            ldc.m.date.month);
    ldc.v.tabStats.pie.init('pie-debit', data, "x", "y", {title:"Débit"});
    var data = ldc.m.stats.getCatChildren(ldc.v.tabStats.catId, 'credit', ldc.m.date.year-ldc.v.tabStats.nbYear, ldc.m.date.month, ldc.m.date.year, ldc.m.date.month);
    ldc.v.tabStats.pie.init('pie-credit', data, "x", "y", {title:"Crédit"});
    var data = ldc.m.stats.getCatDebit(ldc.v.tabStats.catId , ldc.m.date.year-ldc.v.tabStats.nbYear, ldc.m.date.month, ldc.m.date.year, ldc.m.date.month);
    ldc.v.tabStats.line.init('line-debit', data, "x", "y", {title:"Débit"});
}

ldc.v.tabStats.update = function () {
    var data = ldc.m.stats.getTotal(
                ldc.m.date.year-ldc.v.tabStats.nbYear,
                ldc.m.date.month,
                ldc.m.date.year,
                ldc.m.date.month);
    ldc.v.tabStats.line.update('total-stats', data);

    var data = ldc.m.stats.getCatChildren(
                ldc.v.tabStats.catId,
                'debit',
                ldc.m.date.year-ldc.v.tabStats.nbYear,
                ldc.m.date.month,
                ldc.m.date.year,
                ldc.m.date.month);
    ldc.v.tabStats.pie.update('pie-debit', data);

    var data = ldc.m.stats.getCatChildren(
                ldc.v.tabStats.catId,
                'credit',
                ldc.m.date.year-ldc.v.tabStats.nbYear,
                ldc.m.date.month,
                ldc.m.date.year,
                ldc.m.date.month);
    ldc.v.tabStats.pie.update('pie-credit', data);

    var data = ldc.m.stats.getCatDebit(
                ldc.v.tabStats.catId,
                ldc.m.date.year-ldc.v.tabStats.nbYear,
                ldc.m.date.month,
                ldc.m.date.year,
                ldc.m.date.month);
    ldc.v.tabStats.line.update('line-debit', data);
}


ldc.v.tabStats.slider = function() {
    var html = '<div id="tab-stats-slider">';
    html += '<p><label for="nbYear">Nombre d\'années :</label>';
    html += '<input type="text" id="nbYear" style="border:0; color:#f6931f; font-weight:bold;" />';
    html += '</p>';
    html += '<div id="slider-vertical" style="height:200px;"></div></div>';
    $("#tab-stats").append(html);
    $("#slider-vertical").slider({
        orientation: "vertical",
        range: "min",
        min: 1,
        max: 5,
        value: 1,
        slide: function(event, ui) {
            $("#nbYear").val(ui.value);
            ldc.v.tabStats.nbYear = ui.value;
            ldc.v.tabStats.update();
        }
    });
    $("#nbYear").val($("#slider-vertical").slider("value"));

}

ldc.v.tabStats.line = {};

ldc.v.tabStats.line.charts = {};

ldc.v.tabStats.line.init = function(id, data, xTitle, yTitle, options) {
    var html = '<div id="'+id+'"><div>';
    $("#tab-stats").append(html);

    var gData = new google.visualization.DataTable();
    gData.addColumn('string', xTitle);
    gData.addColumn('number', yTitle);
    for(var i in data) {
        gData.addRow(data[i]);
    }
    var chart = new google.visualization.LineChart(document.getElementById(id));
    ldc.v.tabStats.line.charts[id] = {};
    ldc.v.tabStats.line.charts[id].options = options;
    if(ldc.v.tabStats.line.charts[id].options.width == undefined) {
        ldc.v.tabStats.line.charts[id].options.width = 1000;
    }
    if(ldc.v.tabStats.line.charts[id].options.height == undefined) {
        ldc.v.tabStats.line.charts[id].options.height = 300;
    }
    ldc.v.tabStats.line.charts[id].options.xTitle = xTitle;
    ldc.v.tabStats.line.charts[id].options.yTitle = yTitle;
    chart.draw(gData, ldc.v.tabStats.line.charts[id].options);
}

ldc.v.tabStats.line.update = function(id, data) {
    if (ldc.v.tabStats.line.charts[id] == undefined) {
        alert("ldc.v.tabStats.line.charts[id] == undefined");
        return false;
    }
    var gData = new google.visualization.DataTable();
    var xTitle = ldc.v.tabStats.line.charts[id].xTitle;
    var yTitle = ldc.v.tabStats.line.charts[id].yTitle;
    gData.addColumn('string', xTitle);
    gData.addColumn('number', yTitle);
    for(var i in data) {
        gData.addRow(data[i]);
    }
    var chart = new google.visualization.LineChart(document.getElementById(id));
    chart.draw(gData, ldc.v.tabStats.line.charts[id].options);
}


/******************** PIE ****************************/

ldc.v.tabStats.pie = {};

ldc.v.tabStats.pie.charts = {};

ldc.v.tabStats.pie.init = function (id, data, xTitle, yTitle, options) {
    var html = '<div id="'+id+'"><div>';
    $("#tab-stats").append(html);
    var gData = new google.visualization.DataTable();
    gData.addColumn('string', xTitle);
    gData.addColumn('number', yTitle);
    for(var i in data) {
        gData.addRow(data[i]);
    }
    ldc.v.tabStats.pie.charts[id] = {};
    ldc.v.tabStats.pie.charts[id].options = options;
    if(ldc.v.tabStats.pie.charts[id].options.is3D == undefined) {
        ldc.v.tabStats.pie.charts[id].options.is3D = true;
    }
    if(ldc.v.tabStats.pie.charts[id].options.width == undefined) {
        ldc.v.tabStats.pie.charts[id].options.width = 400;
    }
    if(ldc.v.tabStats.pie.charts[id].options.height == undefined) {
        ldc.v.tabStats.pie.charts[id].options.height = 240;
    }
    ldc.v.tabStats.pie.charts[id].options.xTitle = xTitle;
    ldc.v.tabStats.pie.charts[id].options.yTitle = yTitle;
    var chart = new google.visualization.PieChart(document.getElementById(id));
    chart.draw(gData, ldc.v.tabStats.pie.charts[id].options);
}


ldc.v.tabStats.pie.update = function (id, data) {
    if (ldc.v.tabStats.pie.charts[id] == undefined) {
        alert("ldc.v.tabStats.pie.charts[id] == undefined");
        return false;
    }
    var gData = new google.visualization.DataTable();
    var xTitle = ldc.v.tabStats.pie.charts[id].xTitle;
    var yTitle = ldc.v.tabStats.pie.charts[id].yTitle;
    gData.addColumn('string', xTitle);
    gData.addColumn('number', yTitle);
    for(var i in data) {
        gData.addRow(data[i]);
    }
    var chart = new google.visualization.PieChart(document.getElementById(id));
    chart.draw(gData, ldc.v.tabStats.pie.charts[id].options);
}

/******************************************************************************
  * Formulaire
******************************************************************************/
ldc.v.form = {};

ldc.v.form.init = function() {
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
            html += '<input size="5" type="text" class="val" value="'+val+'"/>';
            html += '<a href="#" class="del">Supprimer</a>';
            html += '</li>';
            $("#form li.cats ul").append(html);
        }

        function empty() {
            $("#form li.cats ul").empty();
        }

        function setTop(name, value) {
            if (name == 'id') {
                $("#form li.cats input.top-id").val(value);
            }
            if (name == 'name') {
                $("#form li.cats input.top-name").val(value);
            }
            if (name == 'val') {
                $("#form li.cats input.top-val").val(value);
            }
        }

        function set(name, value) {
            if (name == 'id') {
                $("#form li.cats input.top-id").val(value);
            }
            if (name == 'name') {
                $("#form li.cats input.top-name").val(value);
            }
            if (name == 'val') {
                $("#form li.cats input.top-val").val(value);
            }
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
        function setError(name) {
            $("#form li.cats .top-"+name).addClass('ui-state-error');
        }
        function removeError(name) {
            if (name == undefined) {
                $(this).removeClass('ui-state-error');
            } else {
                $("#form li.cats .top-"+name).removeClass('ui-state-error');
            }
        }
        function del() {
            $(this).parent().remove();
        }

        ldc.v.form.cats.add = add; 
        ldc.v.form.cats.get = get; 
        ldc.v.form.cats.del = del; 
        ldc.v.form.cats.set = set;
        ldc.v.form.cats.setTop = setTop;
        ldc.v.form.cats.empty = empty;
        ldc.v.form.cats.removeError = removeError; 
        ldc.v.form.cats.setError = setError; 
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


    $("#form li.cats").delegate('input.top-name', 'click', function() {
            ldc.v.popup.cats.open();
    });
    $("#form li.cats").delegate('#form li.cats .del', 'click', ldc.v.form.cats.del);

    // datepicker
    $("#datepicker").datepicker({ dateFormat: 'yy-mm-dd' });
    // radios
    $("#type").buttonset();
    // dialog
    $("#form").dialog({ 
            modal: true,
            buttons: { "Ok": ldc.c.operations.add},
            autoOpen: false,
            draggable: false,
            title: 'Opérations',
            width: 500,
            resizable: false
    });

    $('#form li.cats button.add').click(function() {
            var name = $('#form li.cats .top-name').val();
            var id =  $('#form li.cats .top-id').val();
            var val =  $('#form li.cats .top-val').val();
            if (id == '') {
                ldc.v.form.cats.setError('name');
                return false;
            }
           if (val == 0) { 
                ldc.v.form.cats.setError('val');
                return false;
            }
            ldc.v.form.cats.setTop('name', '');
            ldc.v.form.cats.setTop('id', '');
            ldc.v.form.cats.setTop('val', '0');
            ldc.v.form.cats.add(id, name, val);
            return false;
        });

    $("#form li.cats input.top-val").click(function() {
        ldc.v.form.cats.removeError('val');;
    });

    ldc.v.form.open = open;
    }



/* POPUP cats */

ldc.v.popup = {};
ldc.v.popup.cats = {};
ldc.v.popup.cats.id = 'popup_cats';

ldc.v.popup.cats.init = function () {

    function select(NODE, TREE_OBJ) {
        var cat_id = $(NODE).attr('cat_id');
        var c = ldc.m.categories.get(cat_id);
        ldc.v.form.cats.setTop('id', c.id);
        ldc.v.form.cats.setTop('name', c.name);
        ldc.v.form.cats.removeError('name');
        ldc.v.popup.cats.close();
        return false;
    }

    var callbacks = { onselect : select };
    ldc.v.categories.tree($('body'), 'popup_cats', callbacks);
    $("#popup_cats").dialog({
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
    $("#submenu a[href=#params]").click(function() {
            $("#params").dialog('open');
    });
    $("#params li.cats button.add").click(ldc.c.params.add);
    $("#params li.cats button.del").click(ldc.c.params.del);
    $("#params li.cats button.rename").click(ldc.c.params.rename);
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


