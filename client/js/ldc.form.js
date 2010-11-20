
ldc.form = function(pre_cb, post_cb) {

    pre_cb("ldc.form");

    var AJAX_URL = "html/form.html";
    var SELECTOR = "#form";
    var IS_INIT = false;

    var CURRENT_CAT = undefined;
    

    ldc.form.data = {};



    function selectAutoComplete(event, ui) {
        var name = $(ui.item).val();
        var id = ldc.form.data.categories[name];
        if (id == undefined) {
            alert("Error");
            return false;
        }
    }


    ldc.form.setCat = function(name)
    {
        CURRENT_CAT.children(".cat-name").val(name);
        var jInput = CURRENT_CAT.children("input.cat-name");
        checkCat(jInput);
    }

    ldc.form.setAutocomplete = function()
    {
        $(".cat-name").autocomplete({
                source: ldc.cat.data.names,
        });
    }

    function cat2html(name, somme) {
        var html = '<div class="cat">';
        html += '<div class="form-row">';
        html += '<label><strong>Catégorie :</strong></label>';
        html += '<input name="cat-id" class="cat-id" type="hidden" value="" ;/>';
        if (name != undefined) {
            html += ' <input name="cat-name" class="cat-name" value="'+name+'"/>';
        } else {
            html += ' <input name="cat-name" class="cat-name" value=""/>';
        }
        html += '<button class="cat-tree">Choix</button>';
        html += '</div>';
        html+= '<div class="somme form-row">';
        html += '<label><strong>Somme :</strong></label>';
        if (somme != undefined) {
            html += '<input class="somme" type="text" size="5"  value="'+formatSomme(somme)+'"/>';
        } else {
            html += '<input class="somme" type="text" size="5" value="" />';
        }
        if ($(".cat").length > 0) {
            html += '<a class="del" href="#">Supprimer</a>';
        }
        html += '</div>';
        html += '</div>';
        return html;
    }

    function initCategories(html, id) {
        $(".after-cat").before(cat2html());
        ldc.form.setAutocomplete();
        ldc.catTreeDialog();

        $("#op-form").delegate("input.cat-name", "blur", function() {
                checkCat($(this));
        });

        /* open tree */
        $("#op-form").delegate("div.cat button.cat-tree", "click", function() {
                CURRENT_CAT = $(this).parent();
                $("#cat-tree-dialog").dialog("open");
                return false;
        });

        $("#add-cat").click(function() {
                $(this).parent().before(cat2html());
                ldc.form.setAutocomplete();
                return false;
        });

        $("#op-form").delegate('.del', 'click', function() {
                $(this).parent().parent().remove();
                return false;
        });

    }


    function clickSommeInput() {
        var value = $(this).val()
        value = value.replace(/€/,"");
        $(this).val(value);
        $(this).select();
    }


    function fillForm() {
        clearForm();
        /* preset */
        if (ldc.OID <= 0) {
            return false;
        }
        ldc.op.get(ldc.OID, function(op) {
                /* date */
                var dateStrEn = op.date;
                var oDate     = $.datepicker.parseDate("yy-mm-dd", dateStrEn);
                var dateStrFr = $.datepicker.formatDate("dd/mm/yy", oDate);
                $("#op-form .date input").val(dateStrFr);
                /* type & compte */
                if (op.from == ldc.CID) {
                    $("#op-form .type select").val("debit");
                    $("#op-form .compte select").val(op.to);
                    $("#form .compte label strong").text("Pour :");
                } else {
                    $("#op-form .type select").val("credit");
                    $("#op-form .compte select").val(op.from);
                    $("#op-form .compte label strong").text("De :");
                }
                /* cats & somme */
                $("#op-form .cat").remove();
                for(var i in op.cats) {
                    var cat = op.cats[i];
                    $(".after-cat").before(cat2html(cat.name, cat.val));
                }
                /* check */
                if (op.confirm == 1) {
                    $("#op-form .check select").val('true');
                } else {
                    $("#op-form .check select").val('false');
                }
                /* description */
                $("#op-form .description textarea").val(op.description);
        });
    }

    function clearForm() {
        //$("#op-form .date input").val("");
        /* cats & somme */
        $("#op-form .cat").remove();
        $(".after-cat").before(cat2html());
        
        /* description */
        $("#op-form .description textarea").val("");
        return false;
    }


    function fillNewForm() {
        // complete HTML
        for(var i in ldc.comptes.data) {
            var name = ldc.comptes.data[i].bank + ' - ' + ldc.comptes.data[i].name;
            var id = ldc.comptes.data[i].id;
            if (id != ldc.CID) {
                $("div#form .compte select").append('<option value="'+id+'">'+name+'</option>');
            }
        }
        $("div#form .compte select").append('<option selected="selected" value="0">Extérieur</option>');

        // débit, credit
        $("#form .type select").change(function() {
                if ($(this).val() == "credit") {
                    $("#form .compte label strong").text("De :");
                } else {
                    $("#form .compte label strong").text("Pour :");
                }
        });

        /* French initialisation for the jQuery UI date picker plugin. */
        /* Written by Keith Wood (kbwood{at}iinet.com.au) and Stéphane Nahmani (sholby@sholby.net). */
        $.datepicker.regional['fr'] = {
        closeText: 'Fermer',
        prevText: '&#x3c;Préc',
        nextText: 'Suiv&#x3e;',
        currentText: 'Courant',
        monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin',
        'Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
        monthNamesShort: ['Jan','Fév','Mar','Avr','Mai','Jun',
        'Jul','Aoû','Sep','Oct','Nov','Déc'],
        dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
        dayNamesShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
        dayNamesMin: ['Di','Lu','Ma','Me','Je','Ve','Sa'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''};

        $.datepicker.setDefaults($.datepicker.regional['fr']);

        // datepicker
        $("#datepicker").datepicker({
            showOn: "button",
            buttonImage: "images/calendar.gif",
            buttonImageOnly: true
        });

        // somme
        $("#op-form").delegate(".somme input", "click", clickSommeInput);
        $("#op-form").delegate(".somme input", "blur",
            function() {
                checkSomme($(this));
            }
        );



        /* Description */
        $("#form .description").hide();
        $("#add-desc").click(function() {
                $(this).parent().remove();
                $("#form .description").show();
        });

        initCategories();


    }



    function xtractSomme(jInput) {
        var str = jInput.val();
        str = str.replace(/\€/, "");
        str = str.replace(/,/, ".");
        var value = parseFloat(str);
        if (isNaN(value)) {
            ERROR("Invalid somme: "+str);
        }
        return value;
    }

    function formatSomme(str) {
        str = str.replace(/\€/,"");
        str = str.replace(/,/,".");
        var value = parseFloat(str);
        if (isNaN(value)) {
            return "0,00€";
        } else {
            str = sprintf("%.2f€", value);
            str = str.replace(/\./,",");
            return str;
        }
    }

    function checkSomme(jInput) {
        var str = jInput.val();
        str = str.replace(/\€/,"");
        str = str.replace(/,/,".");
        var value = parseFloat(str);
        if (isNaN(value)) {
            jInput.addClass("ui-state-error");
            ldc.logger.error("Somme: valeur incorrecte");
            return false;
        } else {
            str = sprintf("%.2f€", value);
            str = str.replace(/\./,",");
            jInput.val(str);
            jInput.removeClass("ui-state-error");
            return true;
        }
    }

    function checkCat(jInput) {
        INFO("checkCat");
        var name = jInput.val();
        DEBUG(name);
        var id = ldc.cat.data.byName[name];
        if (id == undefined) {
            jInput.addClass("ui-state-error");
            ldc.logger.error("Catégorie : invalide");
            return false;
        } else {
            jInput.removeClass("ui-state-error");
            return true;
        }
    }

    function checkDate() {
        INFO(checkDate);
        var jInput = $("#op-form .date input");
        if (jInput.val() == "") {
            jInput.addClass("ui-state-error");
            ldc.logger.error("Date : vide");
            return false;
        } else {
            jInput.removeClass("ui-state-error");
            return true;
        }
    }

    function validForm()
    {
        var error = false;

        /* check empty date */
        if (!checkDate()) {
            error = true;
        }


        /* Categories */
        $(".cat-name").each(function(index) {
                if (!checkCat($(this))) {
                    error = true;
                }
        });

        /*Sommes */
        $("#op-form .somme input").each(function(index) {
                if (!checkSomme($(this))) {
                    error = true;
                }
        });

        if (error) {
            return false;
        }

        /* convert date */
        var dateStrFr = $("#op-form .date input").val();
        var oDate     = $.datepicker.parseDate("dd/mm/yy", dateStrFr);
        var dateStrEn = $.datepicker.formatDate("yy-mm-dd", oDate);

        /* from/to */
        if ($("#op-form .type select").val() == "debit") {
            var from = ldc.CID;
            var to = $("#op-form .compte select").val();
        } else if ($("#op-form .type select").val() == "credit") {
            var to = ldc.CID;
            var from = $("#op-form .compte select").val();
        } else {
            ERROR("débit ou crédit?");
        }

        /* description */
        var desc = $("#op-form .description textarea").val();

        /* confirm */
        if ($("#op-form .check select").val() == 'true') {
            var conf = 1;
        } else if ($("#op-form .check select").val() == 'false') {
            var conf = 0;
        } else {
            ERROR("pointé ou non?");
        }

        /* cats */
        var i = 0;
        var cats = [];
        $("#op-form .cat-name").each(function(index) {
                var name = this.value;
                var id = ldc.cat.data.byName[name];
                cats[i] =  {};
                cats[i].id = id;
                i++;
        });

        /*Sommes */
        i = 0;
        $("#op-form input.somme").each(function(index) {
                cats[i].val = xtractSomme($(this));
                i++;
        });

        var op = {
            "date": dateStrEn,
            "from": from,
            "to": to,
            "description": desc,
            "confirm": conf,
            "cats":cats
        }
        if (ldc.OID == 0) {
            ldc.op.add(op, function() {
                    ldc.opTable.update();
                    ldc.topPanel.update();
                    }
            );
        } else {
            op.id = ldc.OID;
            ldc.op.update(op, function() {
                    ldc.opTable.update();
                    ldc.topPanel.update();
                }
            );
        }
        $("#form").dialog('close');
        return false;
    }





    function form_cb() {
        if (!IS_INIT) {
            fillNewForm();
            $("#form").dialog({ 
                    modal: true,
                    buttons: { "Ok": validForm, "Annuler": function() { $(this).dialog('close');}},
                    autoOpen: true,
                    draggable: false,
                    title: 'Opérations',
                    width: 500,
                    resizable: true
            });
            IS_INIT = true;
        } else {
            fillForm();
            $("#form").dialog('open' );
        }
    }

    ldc.form.open = function() {
        if (!IS_INIT) {
            $(SELECTOR).load(AJAX_URL, form_cb);
        } else {
            form_cb();
        }
        return false;
    }

    post_cb("ldc.form");

}
