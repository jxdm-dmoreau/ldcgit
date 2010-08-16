
ldc.form = function() {

    var AJAX_URL = "html/form.html";
    var SELECTOR = "#form";
    
    ldc.logger.error("Jie est très jolie");


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
        /*
        //$("#form .description label").hide();
        //$("#form .description textarea").hide();
        DEBUG($("#form .description label"));
        $("#form .description &").click(function() {
                $("#form .description label").show();
                $("#form .description textarea").show();
                return false;
        });
        */

        for(var i in ldc.data.cats) {
            var name = ldc.data.cats[i].name;
            var id = ldc.data.cats[i].id;
            $("div#form .cat select").append('<option value="'+id+'">'+name+'</option>');
        }

        $("div#form").delegate(".cat select", "change", 
            function() {
                /* Remove all children */
                var index = $(this).parent().index(".cat");
                $("#form .cat:gt("+index+")").remove();
                addSelectCat($(this).val());
                return false;
            }
        );
        //ldc.catTree.fill();

        // actions
        /*
        $("div#form .top-name").click(function() {
                ldc.catTree.
                */
    }


    function form_cb() {
        fillForm();
        $("#form").dialog({ 
                modal: true,
                buttons: { "Ok": function() { alert("coucou")}},
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
