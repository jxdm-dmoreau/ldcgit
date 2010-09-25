
ldc.form = function() {

    var AJAX_URL = "html/form.html";
    var SELECTOR = "#form";

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
        html += '<label><strong>Catégories :</strong></label>';
        html += '<input name="cat-id" class="cat-id" type="hidden" value="" />';
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
            html += '<input class="somme" type="text" size="5" value="'+somme+'"/>';
        } else {
            html += '<input class="somme" type="text" size="5" value=""/>';
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

        /* open tree */
        $("#op-form").delegate("div.cat button.cat-tree", "click", function() {
                CURRENT_CAT = $(this).parent();
                $("#cat-tree-dialog").dialog("open");
                return false;
        });

        $("#add-cat").click(function() {
                $(this).parent().before(cat2html());
                return false;
        });

        $("#op-form").delegate('.del', 'click', function() {
                $(this).parent().parent().remove();
                return false;
        });

    }

    function fillForm() {
        // complete HTML
        for(var i in ldc.data.comptes) {
            var name = ldc.data.comptes[i].bank + ' - ' + ldc.data.comptes[i].name;
            var id = ldc.data.comptes[i].id;
            if (id != ldc.CID) {
                $("div#form .compte select").append('<option value="'+id+'">'+name+'</option>');
            }
        }
    $("div#form .compte select").append('<option value="0">Extérieur</option>');

        // débit, credit
        $("#form .type select").change(function() {
                if ($(this).val() == "credit") {
                    $("#form .compte label strong").text("De :");
                } else {
                    $("#form .compte label strong").text("Pour :");
                }
        });


        // datepicker
        $("#datepicker").datepicker({ dateFormat: 'yy-mm-dd' });


        /* Description */
        $("#form .description").hide();
        $("#add-desc").click(function() {
                $(this).parent().remove();
                $("#form .description").show();
        });

        initCategories();

        /* preset */
        if (ldc.OID <= 0) {
            return false;
        }
        ldc.op.get(ldc.OID, function(op) {
                /* date */
                $("#op-form .date input").val(op.date);
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





    function validForm()
    {
        var error = false;
        /* check date */
        var jInput = $("#op-form .date input");
        if (jInput.val() == '') {
            jInput.addClass("ui-state-error");
            ldc.logger.error("Date invalide");
            error = true;
        } else {
            jInput.removeClass("ui-state-error");
        }



        /* Categories */
        $(".cat-name").each(function(index) {
                var name = this.value;
                var id = ldc.cat.data.byName[name];
                if (id == undefined) {
                    $(this).addClass("ui-state-error");
                    ldc.logger.error("Catégorie invalide");
                    error = true;
                } else {
                    $(this).removeClass("ui-state-error");
                    $(this).parent().children(".cat-id").val(id);
                }
        });

        /*Sommes */
        $("#op-form input.somme").each(function(index) {
                if ($(this).val() == '' || $(this).val() <= 0) {
                    $(this).addClass("ui-state-error");
                    ldc.logger.error("Somme invalide");
                    error = true;
                } else {
                    $(this).removeClass("ui-state-error");
                }
        });

        if (error) {
            return false;
        }

        /* Add operation and close */
        var date = $("#op-form .date input").val();

        /* from/to */
        if ($("#op-form .type select").val() == "debit") {
            var from = ldc.CID;
            var to = $("#op-form .compte select").val();
        } else if ($("#op-form .type select").val() == "credit") {
            var to = ldc.CID;
            var from = $("#op-form .compte select").val();
        } else {
            alert("débit ou crédit?");
        }

        /* description */
        var desc = $("#op-form .description textarea").val();

        /* confirm */
        if ($("#op-form .check select").val() == 'true') {
            var conf = 1;
        } else if ($("#op-form .check select").val() == 'false') {
            var conf = 0;
        } else {
            alert("pointé ou non?");
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
                cats[i].val = $(this).val();
                i++;
        });

        var op = {
            "date": date,
            "from": from,
            "to": to,
            "description": desc,
            "confirm": conf,
            "cats":cats
        }
        if (ldc.OID == 0) {
            ldc.op.add(op, function() {
                    ldc.opTable.update();
                    }
            );
        } else {
            op.id = ldc.OID;
            ldc.op.update(op, function() {
                    ldc.opTable.update();
                }
            );
        }
        $("#form").dialog('close');
        return false;
    }





    function form_cb() {
        fillForm();
        $("#form").dialog({ 
                modal: true,
                buttons: { "Ok": validForm, "Annuler": function() { $(this).dialog('close');}},
                autoOpen: true,
                draggable: false,
                title: 'Opérations',
                width: 500,
                resizable: true
        });
    }

    ldc.form.open = function() {
        $(SELECTOR).load(AJAX_URL, form_cb);
        return false;
    }

}
