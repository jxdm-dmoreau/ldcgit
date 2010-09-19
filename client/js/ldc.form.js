
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
        $("div.cat").delegate("a", "click", function() {
                CURRENT_CAT = $(this).parent();
                $("#cat-tree-dialog").dialog("open");
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

        // compte
        $("#form .compte").hide();
        $("form .message-compte .form-icon").click(function() {
                if ($("#form .compte").is(":hidden")) {
                    $("#form .message-compte .ui-icon").removeClass("ui-icon-triangle-1-s");
                    $("#form .message-compte .ui-icon").addClass("ui-icon-triangle-1-n");
                    $("#form .compte select").val(1);
                    $("#form .compte").slideDown();
                } else {
                    $("#form .message-compte .ui-icon").removeClass("ui-icon-triangle-1-n");
                    $("#form .message-compte .ui-icon").addClass("ui-icon-triangle-1-s");
                    $("#form .compte").slideUp(function() {
                        $("#form .compte select").val(0);
                    });
                }
        });

        /* Description */
        $("#form .description").hide();
        $("form .message-desc .form-icon").click(function() {
                if ($("#form .description").is(":hidden")) {
                    $("#form .message-dest .ui-icon").removeClass("ui-icon-triangle-1-s");
                    $("#form .message-desc .ui-icon").addClass("ui-icon-triangle-1-n");
                    $("#form .description").slideDown();
                } else {
                    $("#form .message-desc .ui-icon").removeClass("ui-icon-triangle-1-n");
                    $("#form .message-desc .ui-icon").addClass("ui-icon-triangle-1-s");
                    $("#form .description").slideUp();
                }
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
                width: 800,
                resizable: true
        });
    }

    ldc.form.open = function() {
        $(SELECTOR).load(AJAX_URL, form_cb);
        return false;
    }

}
