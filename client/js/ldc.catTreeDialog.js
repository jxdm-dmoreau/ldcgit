ldc.catTreeDialog = function() {

        var SELECTOR = "#cat-tree-dialog"; 
        var IS_MODIF = false;

        /* tree */
        ldc.catTree.fill();
        $(SELECTOR).dialog({ 
                modal: true,
                buttons: { "Ok": selectCat},
                autoOpen: false,
                draggable: true,
                title: 'Catégories',
                resizable: true
        });
        /* open tree */
        $("div.cat").delegate("a", "click", function() {
                $("#cat-tree-dialog").dialog("open");
                return false;
        });

        /* actions on tree buttons */
        $(SELECTOR+" button.create").click(function() {
                ldc.catTree.create();
                IS_MODIF = true;
                return false;
                });

        $(SELECTOR+" button.remove").click(function() {
                var node = ldc.catTree.getSelected();
                var name = $(node).children('a').text();
                if (confirm("Voulez-vous vraiment supprimer la catégorie "+name+" ainsi que toutes ses sous-categories?")) {
                    ldc.catTree.remove();
                    IS_MODIF = true;
                }
                return false;
                });

        $(SELECTOR+" button.rename").click(function() {
                ldc.catTree.rename();
                IS_MODIF = true;
                return false;
                });



        /* When the node is selected */
        function selectCat() {
            var node = ldc.catTree.getSelected();
            var name = $(node).children('a').text();
            name = name.substring(1, name.length);
            ldc.form.setCat(name);
            if (IS_MODIF) {
                ldc.form.setAutocomplete();
                IS_MODIF = false;
            }
            $(SELECTOR).dialog('close');
        }
}
