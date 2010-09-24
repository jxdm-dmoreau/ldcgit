
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

    function initCategories(html, id) {
        ldc.form.setAutocomplete();
        ldc.catTreeDialog();

        /* open tree */
        $("#op-form").delegate("div.cat button.cat-tree", "click", function() {
                CURRENT_CAT = $(this).parent();
                $("#cat-tree-dialog").dialog("open");
                return false;
        });

        $("#add-cat").click(function() {
                var html = '<div class="cat">';
                html += '<div class="form-row">';
                html += '<label><strong>Catégories :</strong></label>';
                html += '<input name="cat-id" class="cat-id" type="hidden" value="" />';
                html += ' <input name="cat-name" class="cat-name" value=""/>';
                html += '<button class="cat-tree">Choix</button>';
                html += '</div>';
                html+= '<div class="somme form-row">';
                html += '<label><strong>Somme :</strong></label>';
                html += '<input class="top-val" type="text" size="5" />';
                html += '<a class="del" href="#">Supprimer</a>';
                html += '</div>';
                html += '</div>';
                $(this).parent().before(html);
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



        // actions
    }





    function validForm()
    {

        /* Categories */
        $(".cat-name").each(function(index) {
                DEBUG("test");
                var name = this.value;
                var id = ldc.cat.data.byName[name];
                if (id == undefined) {
                    $(this).addClass("ui-state-error");
                    ldc.logger.error("Erreurs dans le formulaire");
                    return false;
                } else {
                    $(this).removeClass("ui-state-error");
                    $(this).parent().children(".cat-id").val(id);
                }
        });
    }





    function form_cb() {
        fillForm();
        $("#form").dialog({ 
                modal: true,
                buttons: { "Ok": validForm},
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
