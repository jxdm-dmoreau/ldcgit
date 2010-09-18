
ldc.form = function() {

    var AJAX_URL = "html/form.html";
    var SELECTOR = "#form";
    

    ldc.form.data = {};


    function fillCatSelect(html, id) {
        $.getJSON("../server/get_cat_children.php?id="+id,
            function(data) {
                if (data == null) {
                    return false;
                }
                for(var i in data) {
                    var name = data[i].name;
                    html += '<option value="'+data[i].id+'">'+name+'</option>';
                }
                html += '</select></div>';
                $(html).insertAfter($("#form .cat:last"));
            }
        );
    }


    function selectAutoComplete(event, ui) {
        var name = $(ui.item).val();
        var id = ldc.form.data.categories[name];
        if (id == undefined) {
            alert("Error");
            return false;
        }
    }


    function initCategories(html, id) {
        /* autocomplete */
        $.getJSON("../server/get_categories6.php",
            function(data) {
                ldc.form.data.categories = data;
                ldc.form.data.catNames = [];
                for (var i in data) {
                    ldc.form.data.catNames.push(i);
                }
                $(".cat-name").autocomplete({
                        source: ldc.form.data.catNames,
                });
            }
        );
        ldc.catTreeDialog();

    }

    function addSelectCat(id) {
        var html = '<div class="cat form-row">';
        html += '<label><strong>Catégories :</strong></label>';
        html += '<select name="cat-name">';
        fillCatSelect(html, id);
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
                var name = this.value;
                var id = ldc.form.data.categories[name];
                if (id == undefined) {
                    $(this).addClass("ui-state-error");
                    ldc.logger.error("Erreurs dans le formulaire");
                    return false;
                } else {
                    $(this).removeClass("ui-state-error");
                    $(this).parent().children(".cat-id").val(id);
                }
                return false;
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
